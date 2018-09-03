<div class="top">
	<div class="title">{{$o->author->name}}</div>
	<div class="buttons">
		@if($o->author->viaf_link != null)
			<a target="_blank" href="{{$o->author->viaf_link}}">VIAF</a>
		@endif
		<i class="fa fa-arrows-alt" data-id="{{$o->author->id}}"></i><i class="fa fa-times fa-lg"></i>
	</div>
	<div class="profile {{$resultType}}">Publication profile</div>
	<div class="citationslink" data-id="{{$o->author->id}}">Details of cited by and citing</div>
</div>
<div class="smallchart {{$type}} small"></div>
<ul>
@foreach($o->publications as $type => $lines)
	@include('smalldetails.publications.'.$type)
@endforeach
</ul>
	
