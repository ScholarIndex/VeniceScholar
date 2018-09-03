	<span class="close">Back to search results</span>
	<img src="/img/Group@2x.png" class="europeanaBtn" data-rT="articles" data-type="{{$type}}" data-id="{{$o->article->id}}" /> 
	<div class="refpanel"></div>
	<ul class="detailsheaders noselect" data-id="{{$o->article->id}}">
		<li class="{{$resultType}}">{{ str_limit($o->article->title, $limit = 60, $end = '...') }}<br /><span>{{isset($o->article->author[0]) ? $o->article->author[0]->name : '' }} - {{@$o->article->year}}</span></li>
		<li style="height:0;padding:0;"></li>
		<li style="height:0;padding:0;"></li>
		<li style="white-space:nowrap;">
			
				
		<ul class="citationsButtons" data-id="{{$o->article->id}}">
			<li data-cat="cited" data-rt="{{$resultType}}" class="rcat {{$type=='cited' ? 'active' : ''}}">is citing<br /><small>{{$citedCount}}</small></li>
			<li data-cat="citing" data-rt="{{$resultType}}" class="rcat {{$type=='citing' ? 'active' : ''}}">has been cited by<br /><small>{{$citingCount}}</small></li>
			<li data-cat="references" data-rt="{{$resultType}}" class="rcat {{$type=='references' ? 'active' : ''}}">References<br /><small>{{$referencesCount}}</small></li>
		</ul>			
			
			
		</li>
	</ul>
	<div class="chart {{$type}}" data-rt="{{$resultType}}" data-id="{{$o->article->id}}"></div>
