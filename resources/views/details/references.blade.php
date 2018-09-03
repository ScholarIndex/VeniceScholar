<i class="fa fa-times fa-2x"></i>
<div class="searchinreference">
	<input class="inreferenceinput" placeholder="Search in text of reference" />
</div>
@foreach($references as $r)
	<p>« {{$r->reference_string}} » p. {{$r->start_img_number}} 
		@if($r->containing_document_id !== null)
			@if($r->containing_document_type == 'article')
				<a target="_blank" href="http://{{ Config::get('vs.LBC_HOST') }}/article/viewer/{{$r->containing_document_id}}#{{$r->start_img_number}}"><i class="fa fa-link"></i></a>
			@elseif($r->containing_document_type == 'book')
				<a target="_blank" href="http://{{ Config::get('vs.LBC_HOST') }}/document/viewer/{{$r->bid}}#{{$r->start_img_number}}"><i class="fa fa-link"></i></a>
			@endif
		@endif
	</p>
@endforeach
