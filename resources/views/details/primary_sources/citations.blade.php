@include('details._headers.primary_sources')
<div class="detailslines">
	<table>
		@foreach($o->{$type} as $cat => $lines)
			@include('details._tables.citations.'.$cat)
		@endforeach
	</table>
</div>