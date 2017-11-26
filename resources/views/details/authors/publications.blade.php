@include('details._headers.authors')	
<div class="detailslines">
	<table>
		@foreach($o->publications as $type => $lines)
			@include('details._tables.publications.'.$type)
		@endforeach
	</table>
</div>