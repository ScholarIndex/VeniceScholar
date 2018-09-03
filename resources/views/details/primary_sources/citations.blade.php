@include('details._headers.primary_sources')
<div class="detailslines">
	<table>
		@foreach(array('books','articles','primary_sources') as $cat)
			{{--*/ $lines = isset($o->{$type}->$cat) ? $o->{$type}->$cat : [] /*--}}
			@include('details._tables.citations.'.$cat)
		@endforeach
	</table>
</div>