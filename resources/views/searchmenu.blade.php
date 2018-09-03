<div id="searchmenu">
	<div class="searchbar">
	<a href="/search"><div class="title"><img src="/img/logo.png" /></div></a>
	<div class="searchform">
		@if( ! isset($noHeadSearch) || $noHeadSearch == false)
			<div class="headfield"><i class="fa fa-search" aria-hidden="true"></i><input type="text" class="headinput" value="" /></div>
		@else
			
		@endif	
		<!--<ul class="filters">
			<li class="chk {{isset($data['in']['authors']) && $data['in']['authors']=='false' ? '' : 'checked'}} authors">Authors</li>
			<li class="chk {{isset($data['in']['articles']) && $data['in']['articles']=='false' ? '' : 'checked'}} articles">Articles</li>
			<li class="chk {{isset($data['in']['books']) && $data['in']['books']=='false' ? '' : 'checked'}} books">Books</li>
			<li class="chk {{isset($data['in']['contributions']) && $data['in']['contributions']=='false' ? '' : 'checked'}} contributions">Contributions</li>
			<li class="chk {{isset($data['in']['primarysources']) && $data['in']['primarysources']=='false' ? '' : 'checked'}} primarysources">Primary sources</li>
		</ul>-->
	</div>
	{{-- <a href="/auth/logout" class="loginname">{{Auth::user()->login}}</a> --}}
	<a href="/venetica" class="venetica">Venetica</a>	
	<a href="/statistics" class="statistics">Statistics</a>
	<a href="/about" class="about">About</a>
	<a><i class="fa fa-question-circle"></i></a>
</div>
</div>	
