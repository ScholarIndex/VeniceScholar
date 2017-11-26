@extends('layout')

@section('content')

<div class="sideinfo">
	<ul>
		<li class="disabled yearfilter">Publication year<br /><br />
			<input type="hidden" name="mindate" />
			<input type="hidden" name="maxdate" />
			<div class="barchart"></div><br />
			<ul><li class="chk year"><span class="nm">Enable year filter</span></li></ul>	
			<div class="yearslider"></div><br /><br />

		</li>
		

		<li class='sub' data-field="publication_language">Language<span class="cnt"></span>
			<ul></ul>	
		</li>
		<li class='sub' data-field="digitization_provenance">Provenance<span class="cnt"></span>
			<ul></ul>	
		</li>
	</ul>
</div>

<div class="resultzone">
	<ul class="resultheaders noselect">
		<li class="cat authors" data-val="1"><span>0</span>Authors</li>
		<li class="cat monographies" data-val="2"><span>0</span>Books</li>
		<li class="cat articles" data-val="4"><span>0</span>Articles</li>
		<li class="cat contributions" data-val="8"><span>0</span>Contributions</li>
		<li class="cat special primary_sources" data-val="16"><span>0</span>Primary sources</li>
		<li class="cat special references" data-val="32"><span>0</span>References</li>
		<li class="pagin">
			<p>Page</p>
			<p><i class="fa fa-chevron-left"></i> <span class="noPage"></span> / <span class="nbPage"></span> <i class="fa fa-chevron-right"></i></p>
		</li>
	</ul>
	<div class="results">
	</div>
</div>
<div class="detailszone"></div>
<div class="smalldetailszone"></div>
@endsection
