@include('details._headers.authors')	
<div class="detailslines">

	<ul class="citationsButtons" data-id="{{$o->author->id}}">
		<li data-cat="cited" data-rt="{{$resultType}}" class="rcat {{$type=='cited' ? 'active' : ''}}">is citing<br /><small>{{$citedCount}}</small></li>
		<li data-cat="citing" data-rt="{{$resultType}}" class="rcat {{$type=='citing' ? 'active' : ''}}">has been cited by<br /><small>{{$citingCount}}</small></li>
	</ul>

	<table>
		@foreach(array('books','articles','primary_sources') as $cat)
			{{--*/ $lines = isset($o->{$type}->$cat) ? $o->{$type}->$cat : [] /*--}}
			@include('details._tables.citations.'.$cat)
		@endforeach
	</table>
</div>
