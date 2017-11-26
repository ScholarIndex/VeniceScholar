<i class="fa fa-times fa-2x"></i>
<div class="searchinreference">
	<input class="inreferenceinput" placeholder="Search in text of reference" />
</div>
@foreach($references as $r)
	<p>« {{$r->reference_string}} » p. {{$r->start_img_number}} <a href="http://{{ Config::get('vs.LBC_HOST') }}/article/viewer/{{$r->containing_document_id}}#{{$r->start_img_number}}"><i class="fa fa-link"></i></a></p>
@endforeach
