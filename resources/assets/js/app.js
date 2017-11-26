var LBC = {
    init : function(){
        var datajs = $('body').attr('data-js');
        if(datajs !== ""){
            window[datajs].init();
        }
    }
};

var SEARCH = {
    root: _JSROOT_,
    cS : 15,    // catSelection
    nbP : 1,    // nbPage
    p : 1,        // page
    q : '',     // query
    r : 0,         // total results in catSelection
    filtrs : {}, //
    params : null, // parsed hash params
    lastParams : null,
    xhr : null,
    searching: false,
    catVal : {
        "references" : 32,
        "primary_sources" : 16,
        "contributions" : 8,
        "articles" : 4,
        "monographies" : 2,
        "authors" : 1
    },
    nsCat : {},
    refreshCat : function(){
        selection = SEARCH.cS;
        $('.cat').removeClass('active');
        $.each(SEARCH.catVal, function(key,val){
            if(selection >= val){
                $('.cat.'+key).addClass('active');
                selection-=val;
            }
        });
    },
    detailsSort : function(tbody, sortIcon){
			if(tbody.hasClass('nestedps')) return;
            var type = sortIcon.hasClass('s-alpha') ? 'alpha' : 'num';
            var dir = sortIcon.hasClass('s-rev') ? 'rev' : '';
            var rows = tbody.find('tr');
            column = sortIcon.closest('th').index();
            var store = [];
            rows.each(function( index ) {
              store.push([$(this).find('td:eq('+column+')').text(), $(this)]);
            });
            store.sort(function(x,y){
                if(type == 'num'){
                    return dir=='rev' ? y[0]-x[0] : x[0]-y[0];
                }else{
                    return dir=='rev' ? y[0].localeCompare(x[0]) : x[0].localeCompare(y[0]);
                }
            });
            tbody.html("");
            for(var i=0; i<store.length; i++){
                tbody.append(store[i][1]);
            }
            sortIcon.toggleClass('s-rev');
    },

    refreshPagin : function(){
        $('span.noPage').html(SEARCH.p);
        $('span.nbPage').html(SEARCH.nbP);
        if(SEARCH.p == 1)
            $('.fa-chevron-left').css('opacity',0);
        else
            $('.fa-chevron-left').css('opacity',1);
        if(SEARCH.p == SEARCH.nbP)
            $('.fa-chevron-right').css('opacity',0);
        else
            $('.fa-chevron-right').css('opacity',1);
    },

    init : function(){
        SEARCH.nsCat[SEARCH.root+"bibliodb_contributions"] = "contributions";
        SEARCH.nsCat[SEARCH.root+"bibliodb_articles"] = "articles";
        SEARCH.nsCat[SEARCH.root+"bibliodb_asve"] = "primary_sources";
        SEARCH.nsCat[SEARCH.root+"bibliodb_authors"] = "authors";
        SEARCH.nsCat[SEARCH.root+"bibliodb_books"] = "monographies";
        SEARCH.nsCat[SEARCH.root+"references"] = "references";
        $(document).on('click', '.searchfield .fa', function(){
            $(this).closest('.mainsearch').toggleClass('adv_open');
        });
        $(document).on('keyup','.searchinput', function(e){
            var code = e.keyCode || e.which;
             if(code == 13) { //Enter keycode
                   document.location = "/results#search="+encodeURIComponent($(this).val())+"&ns="+SEARCH.cS+"&p="+SEARCH.p;
             }
        });
        $(document).on('click', '.advancedsearch .closebutton', function(){
            $('.mainsearch').removeClass('adv_open');
        });
        $(document).on('click', '.resultheaders .cat', function(){
            if(SEARCH.searching) return;
            var clicked = $(this).attr('data-val');
            if(SEARCH.cS == clicked)
                SEARCH.cS = 15;
            else
                SEARCH.cS = clicked;
            SEARCH.p = 1;
            SEARCH.setHashSearch();
        });

		$(document).on('click', '.fa.fa-question-circle', function(){$('#helpwrapper').fadeToggle();});

        $(document).on('click', '.result.authors',                              function(e){	SEARCH.openDetails('authors',         'publications',             $(this).attr('data-id'))});
        $(document).on('click', '.result.authors .shortdetails',                function(e){ e.preventDefault(); e.stopPropagation();	SEARCH.openSmallDetails('authors',         'publications',             $(this).closest('.result').attr('data-id'))});

        $(document).on('click', '.smalldetailszone .citationslink',                              function(){	SEARCH.openDetails('authors',         'cited',             $(this).attr('data-id'))});
        $(document).on('click', '.smalldetailszone .fa-arrows-alt',                              function(){	SEARCH.openDetails('authors',         'publications',             $(this).attr('data-id'))});
        $(document).on('click', '.smalldetailszone .fa-times',                              function(){	SEARCH.setHashSearch();});




        $(document).on('click', '.result.monographies',                         function(){SEARCH.openDetails('monographies',     'references',                 $(this).attr('data-id'));});
        $(document).on('click', '.result.references .subtitle .book',             function(){SEARCH.openDetails('monographies',     'references',                 $(this).attr('data-id'));});
        $(document).on('click', '.result.articles',                             function(){SEARCH.openDetails('articles',         'references',                 $(this).attr('data-id'));});
        $(document).on('click', '.result.references .subtitle .article',         function(){SEARCH.openDetails('articles',         'references',                 $(this).attr('data-id'));});
        $(document).on('click', '.result.primary_sources',                         function(){SEARCH.openDetails('primary_sources','citing',                     $(this).attr('data-id'));});
        $(document).on('click', 'li.rcat',                                         function(){SEARCH.openDetails($(this).attr('data-rt'),         $(this).attr('data-cat'),     $(this).closest('ul').attr('data-id') );});
        $(document).on('click', '.show_refs',                                     function(e){e.preventDefault();e.stopPropagation();SEARCH.openDetails($(this).attr('data-type'),$(this).attr('data-reftype'),$(this).attr('data-id'),    $(this).attr('data-refcat'),$(this).attr('data-refid')); });
        $(document).on('click', '.refpanel>.fa-times', function(){
            SEARCH.openDetails(SEARCH.params.rT, SEARCH.params.type, SEARCH.params.details);
        });

        $(document).on('click', '.nestedps tr.openable', function(){
        	$(this).closest('tbody').hide();
        	$('.nestedps[data-level="'+$(this).attr('data-relatedlevel')+'"]').show();
        });

        $(document).on('click', '.nestedps .fa-chevron-up', function(){
        	$(this).closest('tbody').hide();
        	$('.nestedps[data-level="'+$(this).attr('data-relatedlevel')+'"]').show();
        });

        $(document).on('click', '.detailslines i', function(){
            var sortIcon = $(this);
            var tbody = $(this).closest('tbody').next('tbody');
            SEARCH.detailsSort(tbody, sortIcon);
        });
        $(document).on('click', '.detailszone>.fa-times', function(){
            SEARCH.setHashSearch();
        });
        $(document).on('click', '.sub', function(e){
            if(e.target != this) return;
            $(this).toggleClass('open');
        });
        $(document).on('click', '.headfield i.fa-search', function(){
            if( ! SEARCH.searching){
                SEARCH.q = $('.headinput').val();
                SEARCH.setHashSearch();
            }
        });
        $(document).on('click', '.fa-chevron-left', function(){
            if( ! SEARCH.searching){
                SEARCH.p = Math.max(1, SEARCH.p - 1);
                SEARCH.setHashSearch();
            }
        });
        $(document).on('click', '.fa-chevron-right', function(){
            if( ! SEARCH.searching){
                SEARCH.p = Math.min(SEARCH.nbP, SEARCH.p + 1);
                SEARCH.setHashSearch();
            }
        });
        $(document).on('click', '.chk', function(e){
        	if($(this).hasClass('year'))	$('.yearfilter').toggleClass('disabled');
            $(this).toggleClass('checked');
            SEARCH.readFilters();
            SEARCH.setHashSearch();
        });
        $(document).on('keyup','.headinput', function(e){
            var code = e.keyCode || e.which;
             if(code == 13 && ! SEARCH.searching) { //Enter keycode
                 SEARCH.q = $('.headinput').val();
                   SEARCH.setHashSearch();
             }
        });
        $(document).on('keyup','body', function(e){
            var code = e.keyCode || e.which;
             if(code == 27) { //ESC keycode
                   SEARCH.setHashSearch();
             }
        });

        $(document).on('click', '.allfilters.unselect', function(){
        	$(this).closest('ul').find('li').removeClass('checked');
        	SEARCH.readFilters();
            SEARCH.setHashSearch();
        });
        $(document).on('click', '.allfilters.select', function(){
        	$(this).closest('ul').find('li').addClass('checked');
        	SEARCH.readFilters();
            SEARCH.setHashSearch();
        });

        $(document).on('click', '.smalldetailszone > ul > li > span', function(){
        	$(this).closest('li').toggleClass('open');
        });

        $(document).on('keyup', '.searchreference input', SEARCH.refsearch);
        $(document).on('keyup', '.searchinreference input', SEARCH.inrefsearch);

        $(window).bind( 'hashchange', SEARCH.hashchange);
        SEARCH.hashchange();
    },
    openDetails : function(resultType, type, id, refcat, refid){
    	refcat = typeof refcat !== 'undefined' ? refcat : '';
	    refid = typeof refid !== 'undefined' ? refid : '';
        SEARCH.setHashDetails(resultType, type, id, refcat, refid);
    },
    openSmallDetails : function(resultType, type, id, refcat, refid){
    	refcat = typeof refcat !== 'undefined' ? refcat : '';
	    refid = typeof refid !== 'undefined' ? refid : '';
        SEARCH.setHashSmallDetails(resultType, type, id, refcat, refid);
        
    },

    displayDetails : function(resultType, type, id, refcat, refid){
        $.ajax({
            url: "/details/"+resultType,
            type: "POST",
            data: {
                'id': id,
                'type': type
               },
            dataType: "html",
            beforeSend: function(){
            	$('.fa.fa-pulse').fadeIn();
            },
            success: function (data) {
                $('.detailszone').html(data);
                if(resultType=='authors' && type == 'publications')    SEARCH.loadDetailsChart(id, 'full');
                if(type == 'cited' || type == 'citing')    SEARCH.loadCitationChart(resultType, type, id);
                $('.detailszone').fadeIn();
                $('.fa-sort.default').each(function(){
                    var sortIcon = $(this);
                    var tbody = $(this).closest('tbody').next('tbody');
                    SEARCH.detailsSort(tbody, sortIcon);
                });
                if(refcat !== "" && refid !== ""){
                    SEARCH.displayRefs(resultType, type, id, refcat, refid);
                }else{
                    $('.refpanel').fadeOut();
                    $('.detailslines tr').removeClass('highlight');
                    if(resultType=='authors'){
                    	if(type=='publications')
	                    	$('#helpwrapper').attr('data-step', 'author_details_publications');
    					else
    						$('#helpwrapper').attr('data-step', 'author_details_citations');
                	}
                }
                $('.fa.fa-pulse').fadeOut();
            }, 
            error : function(xhr, ajaxOptions, thrownError){
            	document.location = '/errors/'+xhr.status;	
            }
         });
    },

    displayRefs : function(resultType, type, id, refcat, refid){
      $('.detailslines tr').removeClass('highlight');
       $('a[data-refid="'+refid+'"]').closest('tr').addClass('highlight');
       $('.detailszone').scrollTo($('a[data-refid="'+refid+'"]'), 200, {offset:{top:-50}});
      $.ajax({
          url: "/refs",
          type: "POST",
          data: {
              'resultType': resultType,
              'oid': id,
              'reftype': type,
              'refid': refid,
              'refcat': refcat
             },
          dataType: "html",
          beforeSend: function(){
          	$('.fa.fa-pulse').fadeIn();
          },
          success: function (data) {
            $('.smalldetailszone').animate({'margin-right':-400});
              $('.refpanel').html(data);
              $('.refpanel').fadeIn();
              $('#helpwrapper').attr('data-step', 'references_panel');
              $('.fa.fa-pulse').fadeOut();
          }
       });

    },
    displaySmallDetails : function(resultType, type, id, refcat, refid){
        $.ajax({
            url: "/smalldetails/"+resultType,
            type: "POST",
            data: {
                'id': id,
                'type': type
               },
            beforeSend : function(){
            	$('.fa.fa-pulse').fadeIn();
            	$('.detailszone').fadeOut();
            },
            dataType: "html",
            success: function (data) {
                $('.smalldetailszone').html(data);
                $('.smalldetailszone').animate({'margin-right': 0});
              	if(resultType=='authors' && type == 'publications')    SEARCH.loadDetailsChart(id,'small');
              	$('#helpwrapper').attr('data-step', 'author_small_details');
				$('.fa.fa-pulse').fadeOut();
            }, 
            error : function(xhr, ajaxOptions, thrownError){
            	document.location = '/errors/'+xhr.status;	
            }
         });
    },
    loadDetailsChart : function(authorId, size){

        var Chart = (function(window, d3) {
          var url = '/author/publications/csv/'+authorId;
          var x, y, xAxis, yAxis, svg, chartWrapper, div, nodes, dots, names, fastestTime, legend, allegation, noallegation, sources, margin, width, height;
          var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 90])
            .html(function(d) {
              switch(d.type){
                   case 'articles' : t = 'Article'; break;
                   case 'books': t = 'Book'; break;
                   case 'contributions': t = 'Contribution'; break;
              }
              return "<div>"+t+" - "+d.year+"</div>" +
                      "<div>"+d.title+"</div>" +
                     "<div>"+d.journal+"</div>";
            });
          d3.csv(url, init);
          function init(csv) {
            var years = csv.map(function(item) { return item.year; });
            var placement = csv.map(function(item) { return item.height; });
            var minYear = Math.floor((Math.min.apply(null, years)-1)/10)*10;
            var maxYear = Math.ceil((Math.max.apply(null, years)+1)/10)*10;
            x = d3.scaleLinear()
              .domain([
                  minYear,
                  maxYear
              ]);
            y = d3.scaleLinear()
              .domain([0,Math.max.apply(null,placement)]);
            xAxis = d3.axisBottom(x)
              .tickFormat(d3.format("d"))
              .ticks((size=='small') ? 4 : 8);
            yAxis = d3.axisLeft(y)
              .tickFormat(d3.format("d"))
              .ticks(0);
            // set up svg
            svg = d3.select((size=='full') ? '.chart' : '.smallchart').append('svg');
            svg.call(tip);
            chartWrapper = svg.append('g');
            div = d3.select('body').append('div')
              .attr('class', 'tooltip')
              .style('opacity', 0);
            chartWrapper.append('g')
              .attr('class', 'axis axis--x');
            chartWrapper.append('g')
              .attr('class', 'axis axis--y');
            nodes = chartWrapper.selectAll('.data')
              .data(csv).enter().append('g');
            dots = nodes.append('circle')
                .attr('class', function(d){
                    return 'dot '+d.type;
                })      .on('mouseover', tip.show)
              .on('mouseout', tip.hide);
            nodes.on('mouseover', function(d) {
              d3.select(this.firstChild).attr('r', (size=='small')?7:11);
            })
            .on('mouseout', function(d) {
              d3.select(this.firstChild).attr('r', (size=='small')?4:7);
            });
            render();
          }
          function render() {
            updateDimensions();
            x.range([0, width]);
            y.range([height, 0]);
            svg.attr('width', width + margin.left + margin.right)
              .attr('height', height + margin.top + margin.bottom);
            chartWrapper.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
            xAxis.scale(x);
            yAxis.scale(y);
            xAxisShift = height + 8;
            svg.select('.axis.axis--x')
              .attr('transform', 'translate(0,' + xAxisShift + ')')
              .call(xAxis);
            svg.select('.axis.axis--y')
              .call(yAxis);
            dots.attr('r', (size=='small')?4:7)
              .attr('cx', function(d) { return x(d.year); })
              .attr('cy', function(d) { return y(d.height); });
          }
          function updateDimensions() {
          	var chrt = (size=='full')?'.chart':'.smallchart';
            margin = {top: 30, right: 30, bottom: 30, left: 30 };
            width = $(chrt).innerWidth()-margin.right-margin.left;
            height = $(chrt).innerHeight()-margin.top-margin.bottom;

          }
          return {
            render: render
          }
        })(window, d3);
        window.addEventListener('resize', Chart.render);
    },


    loadCitationChart : function(resultType, type, id){


		var Chart = (function(window, d3) {
			var url = '/'+resultType+'/'+type+'/csv/'+id;
			var margin,width,height,svg,x0,x0b,x1,y,z,categoryGroup,bars;
	        var tip = d3.tip()
	            .attr('class', 'd3-tip cit')
	            .offset([-10, 90])
	            .html(function(d) {
	            	if(d.value == 1)
		            	return d.value+" citation";
		            else
		            	return d.value+" citations";
	            });
			d3.csv(url, processdata, init);

		function init(error, data) {
		  if (error) throw error;




		margin = {top: 20, right: 20, bottom: 30, left: 40};
		width = $('.chart').width() - margin.left - margin.right;
		height = $('.chart').height() - margin.top - margin.bottom;

		svg = d3.select('.chart').append("svg")
			.attr("width", $('.chart').width())
			.attr("height", $('.chart').height());
		svg.call(tip);
		var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		x0 = d3.scaleBand()
		    .rangeRound([0, width])
		    .paddingInner(0.5);

		x0b = d3.scaleBand()
		    .rangeRound([0, width])
		    .paddingInner(0.5);

		x1 = d3.scaleBand().padding(0);

		y = d3.scaleLinear()
		    .rangeRound([height, 0]);

		  var keys = ['citing_h', 'cited_h'];

		  x0.domain(data.map(function(d) { return d.start; }));
		  x0b.domain(data.map(function(d) { return d.end; }));
		  x1.domain(keys).rangeRound([0, x0.bandwidth()]);
		  y.domain([0, 100]).nice();

		  categoryGroup = g.append("g")
		    .selectAll("g")
		    .data(data)
		    .enter().append("g")
			  .attr("class", "xgroup")
		      .attr("transform", function(d) { return "translate(" + x0(d.start) + ",0)"; })
          .attr("data-index", function(d,i) { return i; });
		  bars = categoryGroup.selectAll("rect")
		    .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
		    .enter().append("rect")
		      .attr("class", function(d) { return d.key; })
		      .attr("x", function(d) { return x1(d.key); })
		      .attr("y", function(d) { return y(d.value); })
		      .attr("width", x1.bandwidth())
		      .attr("height", function(d) { return height - y(d.value); })
		      .on('mouseover', function(d){tip.show({key:d.key.replace('_h',''), value:data[$(this).closest('.xgroup').attr('data-index')][d.key.replace('_h','')]})})
          .on('mouseout', tip.hide);


		  g.append("g")
		      .attr("class", "x axis")
		      .attr("transform", "translate(0," + height + ")")
		      .call(d3.axisBottom(x0).tickFormat(function(d){ return d+" -";}));

		  g.append("g")
		      .attr("class", "x axis b")
		      .attr("transform", "translate(5," + (height+10) + ")")
		      .call(d3.axisBottom(x0b).tickFormat(function(d){ return d;}));



				render();
		}

			function processdata(d, i, columns) {
			  for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = +d[columns[i]];
			  return d;
			}

			function render(){
				d3.select("svg").attr('width', $('.chart').width());
				var width = $('.chart').width() - margin.left - margin.right;
				x0.rangeRound([0, width]);
				x0b.rangeRound([0, width]);
				x1.rangeRound([0, x0.bandwidth()]);

				d3.select('.x.axis').call(d3.axisBottom(x0).tickFormat(function(d){ return d+" -";}));
				d3.select('.x.axis.b').call(d3.axisBottom(x0b).tickFormat(function(d){ return d;}));
				categoryGroup.attr("transform", function(d) { return "translate(" + x0(d.start) + ",0)"; });
				bars.attr("width",  x1.bandwidth());
				bars.attr("x", function(d) { return x1(d.key); })
			};

			return {
				render : render
			}
		})(window, d3);
		window.addEventListener('resize', Chart.render);


    },

    doSearch : function(){
        $('.headinput').val(SEARCH.q);
        $('.detailszone').fadeOut();
        $('.smalldetailszone').animate({'margin-right':-400});
        $('li.cat span').text("0");
        if(SEARCH.cS == 32)
	        $('#helpwrapper').attr('data-step', 'search_ref');
    	else
    	    $('#helpwrapper').attr('data-step', 'search');
    	
        SEARCH.countResults();
        SEARCH.yearBarChart();
        SEARCH.loadFilters();
        SEARCH.loadPageResults();
        
    },
    readFilters : function() {
        SEARCH.filtrs = {};
        $('.sub').each(function(){
            var sub = $(this);
            SEARCH.filtrs[sub.attr('data-field')] = [];
            $(this).find('li.checked').each(function(){
                SEARCH.filtrs[sub.attr('data-field')].push($(this).attr('data-key'));
            });
        });
        var mindate = $('input[name="mindate"]').val();
        var maxdate = $('input[name="maxdate"]').val();
        if($('.chk.year').hasClass('checked') && (mindate != "" || maxdate != "")){
            SEARCH.filtrs.year = {};
            SEARCH.filtrs.year.mindate = mindate;
            SEARCH.filtrs.year.maxdate = maxdate;
        }
    },
    loadFilters : function() {
        SEARCH.readFilters();
        $('.sub').each(function(){
            var sub = $(this);
            $.ajax({
                url: "/filters",
                type: "POST",
                data: {
                    'q': SEARCH.q,
                    'filtrs' : SEARCH.filtrs,
                    'field' : sub.attr('data-field')
                },
                dataType: "html",
                success: function (data) {
                    sub.find('ul').html(data);
                }
            });
        });
    },
    countResults : function(){
        $.ajax({
            url: "/countResult",
            type: "POST",
            data: {
                'q': SEARCH.q,
                'filtrs' : SEARCH.filtrs,
               },
            dataType: "json",
            success: function (data) {
                $.each(data.response.facet_counts.facet_fields.ns, function(key,val){
                    var v = (val > 99) ? "99+" : val;
                    $('li.cat.'+SEARCH.nsCat[key]+' span').text(v);
                    $('li.cat.'+SEARCH.nsCat[key]+' span').attr('data-val', val);
                });
                var tot = 0;
                var selection = SEARCH.cS;
                $.each(SEARCH.catVal, function(key,val){
                    if(selection >= val){
                        nb = parseInt($('.cat.'+key+' span').attr('data-val')) || 0;
                        tot += nb;
                        selection-=val;
                    }
                });
                SEARCH.nbP = Math.max( 1, Math.ceil(tot / 10)); // If no result, nbPage = 1 (empty)
                SEARCH.r = tot;
            }
        });
    },
    yearBarChart : function() {
        $.ajax({
            url: "/yearChart",
            type: "POST",
            data: {
                'q': SEARCH.q,
                'filtrs': SEARCH.filtrs
               },
            dataType: "json",
            success: function (data) {
                $('.barchart').html('');
                var range = $('.yearslider')[0];
                try{
                    range.noUiSlider.destroy();
                }catch(e){}
                if(data.length == 0) return;
                var range = $('.yearslider')[0];
                var dataArray = data.val;
                var barwidth = 160/dataArray.length;
                var max = Math.max.apply(null, dataArray);
                var svg = d3.select(".barchart").append("svg")
                          .attr("height","75px")
                          .attr("width","160px");
                svg.selectAll("rect")
                    .data(dataArray)
                    .enter().append("rect")
                          .attr("class", "bar")
                          .attr("height", function(d, i) {return (d/max*75)})
                          .attr("width",barwidth)
                          .attr("x", function(d, i) {return (i * barwidth)})
                          .attr("y", function(d, i) {return 75 - (d/max*75)});
                noUiSlider.create(range, {
                    start: [data.selectedMin,data.selectedMax],
                    connect: true, // Display a colored bar between the handles
                    direction: 'ltr', // Put '0' at the bottom of the slider
                    behaviour: 'tap-drag', // Move handle on tap, bar is draggable
                    step: 1,
                    tooltips: true,
                    range: {
                        'min': data.minYear-(data.maxYear-data.minYear)/4,
                        'max': data.maxYear+(data.maxYear-data.minYear)/4
                    },
                        pips: {
                        mode: 'values',
                        values: [data.minYear,data.maxYear],
                        density: 5
                    },
                      format: {
                          to: function ( value ) {
                            return parseInt(value,10);
                          },
                          from: function (value) { return value; }
                        }
                });
                range.noUiSlider.on('change', function ( values, handle ) {
                    if ( values[handle] < data.minYear ) {
                        range.noUiSlider.set([data.minYear,null]);
                    } else if ( values[handle] > data.maxYear ) {
                        range.noUiSlider.set([null,data.maxYear]);
                    }
                });
                range.noUiSlider.on('set', function ( values) {
                    $('input[name="mindate"]').val(values[0]);
                    $('input[name="maxdate"]').val(values[1]);
                    SEARCH.readFilters();
                    SEARCH.setHashSearch();
                });
            }
        });
    },
    loadPageResults : function(){
        SEARCH.searching = true;
        $('.headfield i.fa').toggleClass('fa-search fa-spinner fa-spin');
        SEARCH.xhr = $.ajax({
            url: "/search",
            type: "POST",
            data: {
                'q': SEARCH.q,
                'ns': SEARCH.cS,
                'p' : SEARCH.p,
                'filtrs' : SEARCH.filtrs,
            },
            beforeSend : function(){
                $('.results').html("");
            	$('.fa.fa-pulse').fadeIn();
            },

            dataType: "html",
            success: function (data) {
                $('.results').append(data);
                SEARCH.refreshPagin();
                SEARCH.refreshCat();
                SEARCH.loadGraph();
                SEARCH.searching = false;
                $('.headfield i.fa').toggleClass('fa-search fa-spinner fa-spin');
                $('.fa.fa-pulse').fadeOut();
            }
        });
    },
    loadGraph : function(){
        $('.result.notGraphed').each(function(){
            var data = [$(this).attr('data-cited'),$(this).attr('data-citing')];
            var radius = 30;
            var color = d3.scaleOrdinal().range(["#0A3B4C", "#D5E3E4"]);
            var arc = d3.arc().outerRadius(radius).innerRadius(0);
            var pie = d3.pie().sort(null).value(function(d) { return d; });
            var svg = d3.select($(this).find('.graph').get(0)).append("svg")
                .attr("width", radius*2)
                .attr("height", radius*2)
                  .append("g")
                .attr("transform", "translate(" + radius + "," + radius + ")");
            var g = svg.selectAll(".arc")
                .data(pie(data))
                .enter().append("g")
                .attr("class", "arc");
            g.append("path")
                .attr("d", arc)
                .style("fill", function(d) { return color(d.data); });
            $(this).removeClass('notGraphed');
        });
    },
    hashchange : function(e){
        hash = window.location.hash.replace(/^#/, "");
        SEARCH.lastParams = SEARCH.params;
        var params = SEARCH.deserialize(hash);
        SEARCH.params = params;
        $('#helpwrapper').attr('data-step', '');
        
        $.ajax({
            url: "/logaction",
            type: "POST",
            data: {
                'params': params
               }
         });        
        
        
        if(hash==''){
            SEARCH.cS = 15;
            SEARCH.q = "";
            SEARCH.nbP = 1;
            SEARCH.p = 1;
            SEARCH.r = 0;
            SEARCH.setHashSearch();
        }
        if(hash.startsWith('search')){
            SEARCH.q = params.search;
            SEARCH.p = parseInt(params.p) || 1;
            SEARCH.cS = params.ns || 15;
            SEARCH.doSearch();
        }
        if(hash.startsWith('smalldetails')){
            SEARCH.displaySmallDetails(params.rT, params.type, params.smalldetails, params.refcat, params.refid);
        }
        if(hash.startsWith('details')){
            if(SEARCH.lastParams !== null && params.rT == SEARCH.lastParams.rT && params.type == SEARCH.lastParams.type && params.details == SEARCH.lastParams.details && params.refcat !== "" && params.refid !== "" ){
              SEARCH.displayRefs(params.rT, params.type,params.details, params.refcat, params.refid);
            }else{
              SEARCH.displayDetails(params.rT, params.type,params.details, params.refcat, params.refid);
            }
        }
    },
    setHashSearch : function(){
        document.location.hash = "search="+encodeURIComponent(SEARCH.q)+"&ns="+SEARCH.cS+"&p="+SEARCH.p+"&h="+objectHash.sha1(SEARCH.filtrs).substr(1,5);
    },
    setHashDetails : function(resultType, type, id, refcat, refid){
        document.location.hash = "details="+id+"&rT="+resultType+"&type="+type+"&refcat="+refcat+"&refid="+refid;
    },
    setHashSmallDetails : function(resultType, type, id, refcat, refid){
        document.location.hash = "smalldetails="+id+"&rT="+resultType+"&type="+type+"&refcat="+refcat+"&refid="+refid;
    },
    deserialize : function(serializedString) {
        var o = {};
        serializedString = serializedString.replace(/\+/g, '%20');
        var formFieldArray = serializedString.split("&");
        $.each(formFieldArray, function(i, pair){
            var nameValue = pair.split("=");
            var name = decodeURIComponent(nameValue[0]);
            var value = decodeURIComponent(nameValue[1]);
            o[name] = value;
        });
        return o;
    },

    refsearch : function(){
		var q = $('.searchreference input').val();
		if(q.length == 0){
			$('.detailslines tr').show();
			return;
		}else{
			$('.detailslines tr').hide();
			$('.detailslines tr td:first-child:contains("'+q+'")').closest('tr').show();
		}
	},
    inrefsearch : function(){
		var q = $('.searchinreference input').val();
		if(q.length == 0){
			$('.refpanel p').show();
			return;
		}else{
			$('.refpanel p').hide();
			$('.refpanel p:contains("'+q+'")').show();
		}
	},

};
$(document).ready(LBC.init);
