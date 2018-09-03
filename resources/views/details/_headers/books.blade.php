	<span class="close">Back to search results</span>
	<img src="/img/Group@2x.png" class="europeanaBtn" data-rT="monographies" data-type="{{$type}}" data-id="{{$o->book->id}}"/> 
	<div class="refpanel"></div>
	<ul class="detailsheaders noselect" data-id="{{$o->book->id}}">
		<li class="{{$resultType}}">{{ str_limit($o->book->title, $limit = 60, $end = '...') }}<br /><span>{{isset($o->book->author[0]) ? $o->book->author[0]->name.' - ' : ''}}{{@$o->book->year}}</span></li>
		<li style="height:0;padding:0;"></li>
		<li style="height:0;padding:0;"></li>
		<li style="white-space:nowrap;">
			
				
		<ul class="citationsButtons" data-id="{{$o->book->id}}">
			<li data-cat="cited" data-rt="{{$resultType}}" class="rcat {{$type=='cited' ? 'active' : ''}}">is citing<br /><small>{{$citedCount}}</small></li>
			<li data-cat="citing" data-rt="{{$resultType}}" class="rcat {{$type=='citing' ? 'active' : ''}}">has been cited by<br /><small>{{$citingCount}}</small></li>
			<li data-cat="references" data-rt="{{$resultType}}" class="rcat {{$type=='references' ? 'active' : ''}}">References<br /><small>{{$referencesCount}}</small></li>
		</ul>			
			
			
		</li>
	</ul>
	<div class="chart {{$type}}" data-rt="{{$resultType}}" data-id="{{$o->book->id}}"></div>
