@include('details._headers.authors')	
<div class="detailslines">

	<ul class="citationsButtons" data-id="{{$o->author->id}}">
		<li data-cat="citing" data-rt="{{$resultType}}" class="rcat {{$type=='citing' ? 'active' : ''}}">Citing<br /><small>(N° of references:{{$citingCount}})</small></li>
		<li data-cat="cited" data-rt="{{$resultType}}" class="rcat {{$type=='cited' ? 'active' : ''}}">Cited by<br /><small>(N° of references:{{$citedCount}})</small></li>
	</ul>

	<table>
		@foreach($o->{$type} as $cat => $lines)
			@include('details._tables.citations.'.$cat)
		@endforeach
	</table>
</div>