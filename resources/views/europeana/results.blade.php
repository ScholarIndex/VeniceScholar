@if(isset($error))
	<li style="text-align:center;">{{$error}}</li>
@else
	@foreach($results as $r)
		<a href="{{$r['europeana_url']}}" target="_blank">
			<li>
				@if(isset($r['thumbnail']))
					<img src="{{@$r['thumbnail']}}" class="thumb" />
				@endif
				<p class="infos">
					<span class="year">{{@$r['year']}}</span>
					<span class="lang">{{strtoupper(@$r['lang'])}}</span>
					@if(stripos(@$r['licence'], 'creativecommons') !== false)
						<i class="fa fa-unlock"></i>
					@else
						<i class="fa fa-lock"></i>
					@endif	
				</p>
				<p class="title">{{@$r['title']}}</p>
				<p class="provider">{{@$r['provider']}}</p>
				
			</li>
		</a>	
	@endforeach
	
	@if($cursor != "")
			
		<li class="loadMore" data-cursor="{{$cursor}}" data-query="{{$query}}">Load more...</li>
	
	@endif
@endif