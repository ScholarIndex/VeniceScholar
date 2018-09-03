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
             }else{
             	SEARCH.suggester();
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

		$(document).on('click', '.europeanaBtn',                				function(e){ e.preventDefault(); e.stopPropagation();	SEARCH.openEuropeana($(this).attr('data-rT'), $(this).attr('data-type'), $(this).attr('data-id'))});
		$(document).on('click', '.europeanazone .fa-times',                     function(){	
			SEARCH.openDetails(SEARCH.params.rT, SEARCH.params.type, SEARCH.params.europeana);
		});

		
        $(document).on('click', '.smalldetailszone .citationslink',                              function(){	SEARCH.openDetails('authors',         'cited',             $(this).attr('data-id'))});
        $(document).on('click', '.smalldetailszone .fa-arrows-alt',                              function(){	SEARCH.openDetails('authors',         'publications',             $(this).attr('data-id'))});
        $(document).on('click', '.smalldetailszone .fa-times',                              function(){	SEARCH.setHashSearch();});




        $(document).on('click', '.result.monographies',                         function(){SEARCH.openDetails('monographies',     'references',                 $(this).attr('data-id'));});
        $(document).on('click', '.result.references .subtitle .book',             function(){SEARCH.openDetails('monographies',     'references',                 $(this).attr('data-id'));});
        $(document).on('click', '.result.articles',                             function(){SEARCH.openDetails('articles',         'references',                 $(this).attr('data-id'));});
        $(document).on('click', '.result.references .subtitle .article',         function(){SEARCH.openDetails('articles',         'references',                 $(this).attr('data-id'));});
        $(document).on('click', '.result.primary_sources',                         function(){SEARCH.openDetails('primary_sources','citing',                     $(this).attr('data-id'));});
        $(document).on('click', 'li.rcat',                                         function(){SEARCH.openDetails($(this).attr('data-rt'),         $(this).attr('data-cat'),     $(this).closest('ul').attr('data-id') );});

		$(document).on('click', 'rect.citing_h',                                  function(){SEARCH.openDetails($(this).closest('.chart').attr('data-rt'),         'citing',    $(this).closest('.chart').attr('data-id') );});
        $(document).on('click', 'rect.cited_h',                                   function(){SEARCH.openDetails($(this).closest('.chart').attr('data-rt'),         'cited',     $(this).closest('.chart').attr('data-id') );});
        

        $(document).on('click', '.show_refs',                                     function(e){e.preventDefault();e.stopPropagation();SEARCH.openDetails($(this).attr('data-type'),$(this).attr('data-reftype'),$(this).attr('data-id'),    $(this).attr('data-refcat'),$(this).attr('data-refid')); });
        $(document).on('click', '.refpanel>.fa-times', function(){
            SEARCH.openDetails(SEARCH.params.rT, SEARCH.params.type, SEARCH.params.details);
        });


		/*if($('tbody.lines').length > 0){
			$('tbody.lines').each(function(){
				tbody = $(this);
				if(tbody.find('tr').length > 10){ 
					tbody.find('tr:nth-child(n+11)').hide();
					tbody.next('.showall').show();
					tbody.next('.showall').click(function(){
						tbody.find('tr').show();
						$(this).remove();
					});
				}
			});
		}*/

        $(document).on('click', '.nestedps tr.openable', function(){
        	$(this).closest('tbody').hide();
        	$('.nestedps[data-level="'+$(this).attr('data-relatedlevel')+'"]').show();
        });

        $(document).on('click', '.nestedps span.up', function(){
        	$(this).closest('tbody').hide();
        	$('.nestedps[data-level="'+$(this).attr('data-relatedlevel')+'"]').show();
        });

	$(document).on('click', 'tr.donthide', function(){
		$(this).closest('tbody').removeClass('books articles references');
		$(this).remove();

	});


        $(document).on('click', '.detailslines i', function(){
            var sortIcon = $(this);
            var tbody = $(this).closest('tbody').next('tbody');
            SEARCH.detailsSort(tbody, sortIcon);
        });
        $(document).on('click', '.detailszone>.close', function(){
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
		
		
		
		$(document).on('click', '.europeanazone .loadMore', SEARCH.loadMoreEuropeana);

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

    openEuropeana : function(resultType, type, id, refcat, refid){
    	refcat = typeof refcat !== 'undefined' ? refcat : '';
	    refid = typeof refid !== 'undefined' ? refid : '';		
        SEARCH.setHashEuropeana(resultType, type, id, refcat, refid);      
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
            	$('.globalSpinner').fadeIn();
				$('.europeanazone').animate({'margin-right': -400});
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
                $('.globalSpinner').fadeOut();
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
          	$('.globalSpinner').fadeIn();
          },
          success: function (data) {
            $('.smalldetailszone').animate({'margin-right':-400});
              $('.refpanel').html(data);
              $('.refpanel').fadeIn();
              $('#helpwrapper').attr('data-step', 'references_panel');
              $('.globalSpinner').fadeOut();
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
            	$('.globalSpinner').fadeIn();
            	$('.detailszone').fadeOut();
            },
            dataType: "html",
            success: function (data) {
                $('.smalldetailszone').html(data);
                $('.smalldetailszone').animate({'margin-right': 0});
              	if(resultType=='authors' && type == 'publications')    SEARCH.loadDetailsChart(id,'small');
              	$('#helpwrapper').attr('data-step', 'author_small_details');
				$('.globalSpinner').fadeOut();
            }, 
            error : function(xhr, ajaxOptions, thrownError){
            	document.location = '/errors/'+xhr.status;	
            }
         });
    },
    displayEuropeana : function(resultType, type, id, refcat, refid){
        $.ajax({
            url: "/europeana",
            type: "POST",
            data: {
                'id': id,
                'resultType': resultType
               },
            beforeSend : function(){
				$('.europeanazone').addClass('loading');
				$('.europeanazone').animate({'margin-right': 0});
			},
            dataType: "html",
            success: function (data) {
                $('.europeanazone>.europeanaResults').html(data);
                $('.europeanazone').removeClass('loading');
                
                
              	$('#helpwrapper').attr('data-step', 'europeana');
            }, 
            error : function(xhr, ajaxOptions, thrownError){
            	document.location = '/errors/'+xhr.status;	
            }
         });
    },	
	
	loadMoreEuropeana : function(){
		var btn = $(this);
		$.ajax({
            url: "/europeanaMore",
            type: "POST",
            data: {
                'q': $(this).attr('data-query'),
                'cursor': $(this).attr('data-cursor')
               },
            beforeSend : function(){
					btn.remove();
			},
            dataType: "html",
            success: function (data) {
                $('.europeanazone>.europeanaResults>ul').append(data);                
            }, 
            error : function(xhr, ajaxOptions, thrownError){
            	document.location = '/errors/'+xhr.status;	
            }
         });	

	
		
	},
	
	
	
    movePublicationTo: function (e){
    	$('.detailszone').scrollTo($('.detailszone tr[data-id="'+e.id+'"]'), 200, {offset:{top:-50}});
    	$('.detailszone tr').removeClass("highlight");
    	$('.detailszone tr[data-id="'+e.id+'"]').addClass("highlight");
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
                })
                .attr('data-id', function(d){
                    return d.id;
                })
              .on('mouseover', tip.show)
              .on('mouseout', tip.hide)
              .on('click', SEARCH.movePublicationTo);
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
            	$('.globalSpinner').fadeIn();
            },

            dataType: "html",
            success: function (data) {
                $('.results').append(data);
                SEARCH.refreshPagin();
                SEARCH.refreshCat();
                SEARCH.loadGraph();
                SEARCH.searching = false;
                $('.headfield i.fa').toggleClass('fa-search fa-spinner fa-spin');
                $('.globalSpinner').fadeOut();
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
        if(hash.startsWith('europeana')){
			SEARCH.displayDetails(params.rT, params.type,params.europeana, params.refcat, params.refid);
            SEARCH.displayEuropeana(params.rT, params.type,params.europeana, params.refcat, params.refid);
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
	setHashEuropeana : function(resultType, type, id, refcat, refid){
        document.location.hash = "europeana="+id+"&rT="+resultType+"&type="+type+"&refcat="+refcat+"&refid="+refid; 
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
			$('.detailslines tr.ref').show();
			return;
		}else{
			$('.detailslines tr.ref').hide();
			$('.detailslines tr.ref td.content:contains("'+q+'")').closest('tr').show();
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
	
	xhrsugg : null,
	suggester : function(){

        if(SEARCH.xhrsugg && SEARCH.xhrsugg.readystate != 4){
            SEARCH.xhrsugg.abort();
        }

		SEARCH.xhrsugg = $.ajax({
            url: "/suggester",
            type: "POST",
            data: {
                'q': $('input.searchinput').val()
            },
            beforeSend : function(){
                $('.suggestlist').html("");
            },

            dataType: "html",
            success: function (data) {
                $('.suggestlist').append(data);
            }
        });
		
		
	}
	
	
	

};

var VENETICA = {
	
	authorsDict : {},
	keywordsDict : {},
	seeds : {},
	filters : {},
	kwResults : [],
	kwCursor : null,
	kwQuery: null,
	results : [],
	ajaxQueries : [],
	
	init : function(){
			// Fill the dropdown menu
			VENETICA.loadSeeds();
		
			// Change view type (card/list)
			$(document).on('click','.view',function(){
				$('#wrapper').toggleClass('cardView');
				$('#wrapper').toggleClass('listView');
			});
			
			// Open a result in a new tab
			$(document).on('click', 'table.rs tbody tr', function(){
				window.open($(this).attr('data-href'), '_blank');
			});
			
			// Open/close a dropdown filter zone
			$(document).on('click', '.filterZone .title', function(){
				 $(this).closest('.filterZone').find('.dropdown').fadeToggle(100);
				 $(this).closest('.filterZone').find('.dropdown').find('input').focus();
			});
			
			// Search in dropdown filter zone
			$(document).on('keyup', '.filterZone input', function(){VENETICA.refreshDropdown($(this).closest('.filterZone'))});
			
			// Go to letter in dropdown filter zone
			$(document).on('click', 'ul.letters li.active', function(){
				$(this).closest('.dropdown').find('.rsList').scrollTo('.group[data-id="'+$(this).text()+'"]', 100); 
			});
			
			// Click on filter dropdown list to add a new filter
			$(document).on('click', '.rsList li.flt', function(){
				var id = $(this).attr('data-id')
				if( ! VENETICA.filters.hasOwnProperty(id)){
					if(Object.keys(VENETICA.filters).length == 10){
						alert('You can choose a maximum of 10 filters');
						return;
					}
					VENETICA.filters[id] = VENETICA.seeds[id];
					VENETICA.filters[id].active = false;
					if($(this).attr('data-type') == 'author') VENETICA.filters[id].results = [];
					
					if($(this).attr('data-type') == 'keyword') VENETICA.kwResults = [];
					VENETICA.refreshFilters();
				}
				$(this).closest('.filterZone').find('.dropdown').fadeToggle(100);
			});
			
			// Delete a filter
			$(document).on('click', '.tags div b', function(){
				delete VENETICA.filters[$(this).closest('div').attr('data-id')];
				if($(this).closest('div').attr('data-type')=='keyword') VENETICA.kwResults = [];
				VENETICA.refreshFilters();
			});

			// Highlight/Unhighlight a filter
			$(document).on('click', '.tags div span', function(){
				if(VENETICA.filters[$(this).closest('div').attr('data-id')].active){
					VENETICA.filters[$(this).closest('div').attr('data-id')].active = false;
				}else{
						$.each(VENETICA.filters, function(id, f){
							VENETICA.filters[id].active = false;
						});
						VENETICA.filters[$(this).closest('div').attr('data-id')].active = true;
				}
				VENETICA.refreshFilters();
			});
			
			// Load more results
			$(document).on('click', '.lazyMore', VENETICA.loadMore);
			$('div.results').on('scroll', function() {
				if($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
					VENETICA.loadMore();
				}
			})

			// Change sorting key (column header click)
			$(document).on('click', 'th', function(){
				var no = $(this).find('i').hasClass('fa-sort');
				var asc = $(this).find('i').hasClass('fa-sort-asc');
				var desc = $(this).find('i').hasClass('fa-sort-desc');
				if(no){
					$('th i').removeClass('fa-sort-asc').removeClass('fa-sort-desc').addClass('fa-sort');
					$(this).find('i').removeClass('fa-sort').addClass('fa-sort-asc');
				}
				if(asc){
					$(this).find('i').removeClass('fa-sort-asc').addClass('fa-sort-desc');
				}
				if(desc){
					$(this).find('i').removeClass('fa-sort-desc').addClass('fa-sort');
				}	
				VENETICA.displayResults();
			});
			
	},
	
	refreshDropdown : function(fz){
		var v = fz.find('input').val();
		fz.find('.rsList .group').hide();
		fz.find('.rsList li').hide();
		fz.find('ul.letters li').removeClass('active');
		fz.find('.rsList li:contains('+v+')').each(function(){
			var li = $(this);
			var gp = li.closest('.group');
			var gph = gp.find('li.header');
			li.show();
			gp.show();
			gph.show();
			fz.find('ul.letters li.'+gph.text()).addClass('active');
		});				
	},
	
	refreshFilters : function(){
		$('div.tags').html('');

		$.each(VENETICA.filters, function(id, f){
			$('div.tags').append('<div data-type="'+f.type+'" data-id="'+id+'" class="'+(f.active?'active':'')+'"><span>'+f.label+'</span><b>×</b></div>');
		});
		
		$('.filters .head span').html('('+Object.keys(VENETICA.filters).length+'/10)');
		
		VENETICA.loadResults();
		
	},
	
	loadSeeds : function(){
		var seeds = [];
		$.ajax({
            url: "/venetica/apiquery",
            type: "POST",
			async: false,
			data : {
				url : "/europeana/venetica",
			},
            dataType: "json",
	        success: function (data){
				seeds = data.seeds;
            }
         })
		 
		
		$.each(seeds, function(id, s){
			var firstLetter = s.label[0].toUpperCase();
			VENETICA.seeds[s.id] = s;
			if(s.type == "author"){
				
				if( ! VENETICA.authorsDict.hasOwnProperty(firstLetter)){
					VENETICA.authorsDict[firstLetter] = [];
				}
				VENETICA.authorsDict[firstLetter].push(s);
			}
			if(s.type == "keyword"){
				
				if( ! VENETICA.keywordsDict.hasOwnProperty(firstLetter)){
					VENETICA.keywordsDict[firstLetter] = [];
				}
				VENETICA.keywordsDict[firstLetter].push(s);
			}
			
			if(s.default){
				VENETICA.filters[s.id] = VENETICA.seeds[s.id];
				VENETICA.filters[s.id].active = false;
				if(s.type == 'author') VENETICA.filters[s.id].results = [];
				if(s.type == 'keyword') VENETICA.kwResults = [];				
			}
			
		});
		
		
		var tmp = {};
		Object.keys(VENETICA.authorsDict).sort().forEach(function(key) {	tmp[key] = VENETICA.authorsDict[key];	});
		VENETICA.authorsDict = tmp;

		var tmp = {};
		Object.keys(VENETICA.keywordsDict).sort().forEach(function(key) {	tmp[key] = VENETICA.keywordsDict[key];	});
		VENETICA.keywordsDict = tmp;

		
		$('.filterZone.authors .rsList').html('');
		$.each(VENETICA.authorsDict, function(letter, arr){
			var group = $('<div class="group" data-id="'+letter+'"></div>');
			group.append($('<li class="header">'+letter+'</li>'));
			$.each(arr, function(id, s){
				group.append($('<li class="flt" data-type="author" data-id="'+s.id+'">'+s.label+'</li>'));
			});
			$('.filterZone.authors .rsList').append(group);			
		});
		

		$('.filterZone.keywords .rsList').html('');
		$.each(VENETICA.keywordsDict, function(letter, arr){
			var group = $('<div class="group" data-id="'+letter+'"></div>');
			group.append($('<li class="header">'+letter+'</li>'));
			$.each(arr, function(id, s){
				group.append($('<li class="flt" data-type="keyword" data-id="'+s.id+'">'+s.label+'</li>'));
			});
			$('.filterZone.keywords .rsList').append(group);			
		});
		
		$('.filterZone').each( function(){	VENETICA.refreshDropdown($(this))});		
		
		VENETICA.refreshFilters();
		
	}, 
	
	loadResults : function(){
	
		if(VENETICA.kwResults.length == 0){
			VENETICA.queryKeywords();
		}
		
		$.each(VENETICA.filters, function(id, s){
			if(s.type == 'author'){
				if(s.results.length == 0){
					VENETICA.queryAuthor(s);
				}
			}
		});
		
		
		VENETICA.displayResults();
	},
	
	queryAuthor : function(s){
		
		VENETICA.ajaxQueries.push ( $.ajax({
            url: "/venetica/apiquery",
            type: "POST",
			data : {
				url : "/europeana/suggest?author_id="+s.id,
			},
            dataType: "json",
			beforeSend : function() { $('.lazyMore').addClass('loading');},
            success: function (data){
				VENETICA.processAuthorResults(s.id, data);
            }
         }));
	}, 
	
	queryMoreAuthor : function(s){
		if(VENETICA.filters[s.id].authorCursor == null) return;
		var params = [];
		params.push('query='+encodeURIComponent(VENETICA.filters[s.id].authorQuery));
		params.push('cursor='+encodeURIComponent(VENETICA.filters[s.id].authorCursor));


		VENETICA.ajaxQueries.push ( $.ajax({
            url: "/venetica/apiquery",
            type: "POST",
			beforeSend : function() { $('.lazyMore').addClass('loading');},
			data : {
				url : "/europeana/suggest?"+params.join('&'),
			},
            dataType: "json",
            success: function (data){
				VENETICA.processAuthorResults(s.id, data);
            }
         }));		
	},
		
	processAuthorResults : function(id, data){
		VENETICA.filters[id].authorCursor = data.cursor;
		VENETICA.filters[id].authorQuery = data.query;
		$.each(data.results, function(i, rs){
			rs.type = 'author';
			rs.author_id = id;
			rs.thumbnail = rs.thumbnail || '';
			rs.title = rs.title || '';
			rs.provider = rs.provider || '';
			rs.year = rs.year || '';
			rs.lang = rs.lang || '';
			rs.licence = rs.licence || '';
			VENETICA.filters[id].results.push(rs);
		});
		VENETICA.displayResults();		
	},
				
	queryKeywords : function(){
		var params=[];
		$.each(VENETICA.filters, function(id, s){
			if(s.type=="keyword") params.push("keyword="+s.label);
		});
		if(params.length == 0)
			return;
		
		VENETICA.ajaxQueries.push ( $.ajax({
            url: "/venetica/apiquery",
            type: "POST",
			beforeSend : function() { $('.lazyMore').addClass('loading');},
			data : {
				url : "/europeana/suggest?"+params.join('&'),
			},
            dataType: "json",
            success: VENETICA.processKwResults
		}));
		
	},

	queryMoreKeywords : function(){
		if(VENETICA.kwCursor == null) return;
		
		var params = [];
		params.push('query='+encodeURIComponent(VENETICA.kwQuery));
		params.push('cursor='+encodeURIComponent(VENETICA.kwCursor));
		

		VENETICA.ajaxQueries.push ( $.ajax({
            url: "/venetica/apiquery",
            type: "POST",
			beforeSend : function() { $('.lazyMore').addClass('loading');},
			data : {
				url : "/europeana/suggest?"+params.join('&'),
			},
            dataType: "json",
            success: VENETICA.processKwResults
         }));		
	},
	
	processKwResults : function(data){
		VENETICA.kwCursor = data.cursor;
		VENETICA.kwQuery = data.query;
		$.each(data.results, function(i, rs){
			rs.type = 'keyword';
			rs.thumbnail = rs.thumbnail || '';
			rs.title = rs.title || '';
			rs.provider = rs.provider || '';
			rs.year = rs.year || '';
			rs.lang = rs.lang || '';
			rs.licence = rs.licence || '';
			VENETICA.kwResults.push(rs);
		});
		VENETICA.displayResults();		
	},
	
	loadMore : function(){
		if ( $('.lazyMore').hasClass('loading')) return;

		var kwLoaded = false;
		
		$.each(VENETICA.filters, function(id, f){
			if(f.type == 'author'){
				VENETICA.queryMoreAuthor(f);
			}
			if(kwLoaded == false && f.type=='keyword'){
				VENETICA.queryMoreKeywords();
				kwLoaded = true;
			}
		});		
	},
	
	mergeResults : function(){
		var kwMerged = false;
		VENETICA.results = [];
		$.each(VENETICA.filters, function(id, f){
			if(f.type == 'author'){
				VENETICA.results = $.merge(VENETICA.results, f.results);
			}
			if(kwMerged == false && f.type=='keyword'){
				VENETICA.results = $.merge(VENETICA.results, VENETICA.kwResults);
				kwMerged = true;
			}
		});
	},
	
	sortResults : function(){
		var hasTagActive = $('.tags div.active').length > 0;
		var tagActive = $('.tags div.active').attr('data-id');
		var tagActiveType = $('.tags div.active').attr('data-type');
		var hasAscSort = $('th i.fa-sort-asc').length > 0;
		var hasDescSort = $('th i.fa-sort-desc').length > 0;
		var sortKey = $('th i.fa-sort-asc,th i.fa-sort-desc').attr('data-key');

		VENETICA.results.sort(function(obj1, obj2) {
			if(hasTagActive){
				if(tagActiveType == 'author'){
					if(obj1.type == 'author' && obj1.author_id == tagActive && ! (obj2.type == 'author' && obj2.author_id == tagActive)) return -1;
					if(obj2.type == 'author' && obj2.author_id == tagActive && ! (obj1.type == 'author' && obj1.author_id == tagActive)) return 1;
				}
				
				if(tagActiveType == 'keyword'){
					if(obj1.type == 'keyword' && obj2.type != 'keyword') return -1;
					if(obj2.type == 'keyword' && obj1.type != 'keyword') return 1;
				}
			}
			
			if( hasAscSort || hasDescSort ){
				var v1 = obj1[sortKey].toLowerCase();
				var v2 = obj2[sortKey].toLowerCase();
				if(sortKey == 'year' && hasAscSort){
					if(v1 == '') v1=999999;
					if(v2 == '') v2=999999;
				}
				if(sortKey == 'year' && hasDescSort){
					if(v1 == '') v1=-999999;
					if(v2 == '') v2=-999999;
				}				
			}
			if( hasAscSort ){
				if(v1 != v2) return (v1 > v2) - (v1 < v2);
			}

			if( hasDescSort ){
				if(v1 != v2) return (v2 > v1) - (v2 < v1);
			}

			
			return 1;
		});
	},
	
	displayResults : function(){
		VENETICA.mergeResults();
		VENETICA.sortResults();
		
		var kwHighlight = $('.tags div.active[data-type="keyword"]').length > 0;
		var authHighlight = $('.tags div.active[data-type="author"]').length > 0 ? $('.tags div.active[data-type="author"]').attr('data-id') : '';
		
		$('table.rs tbody').html('');
		$.each(VENETICA.results, function (i,rs){ 
			var tr = $('<tr data-href="'+rs.europeana_url+'"></tr>');
			if(kwHighlight && rs.type=="keyword") tr.addClass('active');
			if(authHighlight != '' && rs.type=="author" && rs.author_id == authHighlight) tr.addClass('active');
			tr.append('<td class="thumb"><img src="'+rs.thumbnail+'" /></td>');
			tr.append('<td class="title"><span class="listTitle">'+rs.title+'</span><span class="cardTitle">'+truncate(rs.title, 35)+'</span></td>');
			tr.append('<td class="provider">'+rs.provider+'</td>');
			tr.append('<td class="year">'+rs.year+'</td>');
			tr.append('<td class="lang">'+rs.lang+'</td>');
			if(rs.licence.indexOf('creativecommons') == -1)
				tr.append('<td class="licence"><i class="fa fa-lock"></i></td>');
			else
				tr.append('<td class="licence"><i class="fa fa-unlock"></i></td>');
			$('table.rs tbody').append(tr);			
		});
		
		VENETICA.updateLoadMoreButton();
	},
	
	updateLoadMoreButton : function(){
		var hasRunning = false;
		$.each(VENETICA.ajaxQueries, function (i, a){
			if(a.readyState == 1)
				hasRunning = true;
		});
		if( ! hasRunning){
			VENETICA.ajaxQueries = [];
			$('.lazyMore').removeClass('loading');
		}
	}
	
	
}

$(document).ready(LBC.init);
