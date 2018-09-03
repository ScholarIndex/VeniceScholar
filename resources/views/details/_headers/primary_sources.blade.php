	<span class="close">Back to search results</span>
	<div class="refpanel"></div>
	<ul class="detailsheaders noselect" data-id="{{$o->primary_source->id}}">
		<li class="{{$resultType}}">{{ str_limit($o->primary_source->label, $limit = 50, $end = '...') }}<a target="_blank" href="{{$o->primary_source->link}}">SiASVe</a></li>
		<li style="height:0;padding:0;"></li>
		<li style="height:0;padding:0;"></li>
		<li style="white-space:nowrap;">
			
				
		<ul class="citationsButtons" data-id="{{$o->primary_source->id}}">
			<li data-cat="citing" data-rt="{{$resultType}}" class="rcat {{$type=='citing' ? 'active' : ''}}">Has been cited by<br /><small>(N° of references:{{$citingCount}})</small></li>
		</ul>			
			
			
		</li>
	</ul>
	<div class="chart {{$type}}" data-rt="{{$resultType}}" data-id="{{$o->primary_source->id}}"></div>
