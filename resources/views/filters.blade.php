<span class="unselect allfilters">Unselect all</span> / <span class="select allfilters">Select all</span>
@foreach($response as $val => $cnt)
	@if($cnt>0)
		<li class="chk {{isset($filtrs[$field]) && in_array($val, $filtrs[$field]) ? 'checked' : ''}}" data-key="{{$val}}"><span class="nm">{{Config::get($field.'.'.$val)}}</span><span class="cn">{{$cnt}}</span></li>
	@endif
@endforeach