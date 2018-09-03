
@include('details._headers.articles')
<div class="detailslines">
	<table>
		{{--*/ $categories = array('books', 'articles', /*'contributions',*/ 'primary_sources'); /*--}}
		@foreach($categories as $cat)
			{{--*/ $lines = isset($o->{$type}->{$cat}) ? $o->{$type}->{$cat} : []; /*--}}
			@include('details._tables.citations.'.$cat)
		@endforeach		
	</table>
</div>