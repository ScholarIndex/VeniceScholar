@include('details._headers.authors')	
<div class="detailslines">
	<table>
		@foreach(array('books','articles') as $type)
			{{--*/ $lines = isset($o->publications->$type) ? $o->publications->$type : [] /*--}}
			@include('details._tables.publications.'.$type)
		@endforeach
	</table>
</div>