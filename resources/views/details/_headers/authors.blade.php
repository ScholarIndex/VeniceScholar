	<span class="close">Back to search results</span>
	<img src="/img/Group@2x.png" class="europeanaBtn" data-rT="authors" data-type="{{$type}}" data-id="{{$o->author->id}}"/> 
	<div class="refpanel"></div>
	<ul class="detailsheaders noselect" data-id="{{$o->author->id}}">
		<li class="{{$resultType}}">{{$o->author->name}}
			@if($o->author->viaf_link != null)
				<a target="_blank" href="{{$o->author->viaf_link}}">VIAF</a>
			@endif
		</li>
		<li style="height:0;padding:0;"></li>
		<li style="height:0;padding:0;"></li>
		<li data-cat='publications' data-rt="{{$resultType}}" class="rcat publications {{$type == 'publications' ? 'active' : ''}}">Publications<br /><small>({{$publicationsCount}})</small></li>
		<li data-cat='cited' data-rt="{{$resultType}}" class="rcat citations {{$type == 'cited' || $type == 'citing' ? 'active' : ''}}">Citations<br /><small>(N° of references: {{$citedCount+$citingCount}})</small></li>
	</ul>
	<div class="chart {{$type}}" data-rt="{{$resultType}}" data-id="{{$o->author->id}}"></div>
