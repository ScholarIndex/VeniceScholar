	<i class="fa fa-times fa-lg"></i>
	<div class="refpanel"></div>
	<ul class="detailsheaders noselect" data-id="{{$o->book->id}}">
		<li class="{{$resultType}}">{{ str_limit($o->book->title, $limit = 60, $end = '...') }}<br /><span>{{isset($o->book->author[0]) ? $o->book->author[0]->name.' - ' : ''}}{{@$o->book->year}}</span></li>
		<li style="height:0;padding:0;"></li>
		<li style="height:0;padding:0;"></li>
		<li style="white-space:nowrap;">
			
				
		<ul class="citationsButtons" data-id="{{$o->book->id}}">
			<li data-cat="references" data-rt="{{$resultType}}" class="rcat {{$type=='references' ? 'active' : ''}}">References<br /><small>(N° of references:{{$referencesCount}})</small></li>
			<li data-cat="citing" data-rt="{{$resultType}}" class="rcat {{$type=='citing' ? 'active' : ''}}">Citing<br /><small>(N° of references:{{$citingCount}})</small></li>
			<li data-cat="cited" data-rt="{{$resultType}}" class="rcat {{$type=='cited' ? 'active' : ''}}">Cited by<br /><small>(N° of references:{{$citedCount}})</small></li>
		</ul>			
			
			
		</li>
	</ul>
	<div class="chart {{$type}}"></div>
