	<i class="fa fa-times fa-lg"></i>
	<div class="refpanel"></div>
	<ul class="detailsheaders noselect" data-id="{{$o->author->id}}">
		<li class="{{$resultType}}">{{$o->author->name}}<a target="_blank" href="{{$o->author->viaf_link}}">VIAF</a></li>
		<li style="height:0;padding:0;"></li>
		<li style="height:0;padding:0;"></li>
		<li data-cat='publications' data-rt="{{$resultType}}" class="rcat publications {{$type == 'publications' ? 'active' : ''}}">Publications<br /><small>({{$publicationsCount}})</small></li>
		<li data-cat='cited' data-rt="{{$resultType}}" class="rcat citations {{$type == 'cited' || $type == 'citing' ? 'active' : ''}}">Citations<br /><small>(N° of references: {{$citedCount+$citingCount}})</small></li>
	</ul>
	<div class="chart {{$type}}"></div>
