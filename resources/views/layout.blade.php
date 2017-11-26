<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Venice Scholar v1.0</title>
	
	<link rel="stylesheet" href="{{ asset('/css/app.css?r='.rand().'') }}">
	<link rel="stylesheet" href="{{ asset('/css/font-awesome.min.css') }}">
	<link rel="stylesheet" href="{{ asset('/css/nouislider.min.css') }}">
	<link href="https://fonts.googleapis.com/css?family=Handlee" rel="stylesheet">

	<script>
		var _JSROOT_="{{config('vs.JSROOT')}}";
	</script>
	<script src="{{ asset('/js/jquery-3.2.0.min.js') }}"></script>
	<script src="{{ asset('/js/jquery.hashchange.min.js') }}"></script>
	<script src="{{ asset('/js/jquery.scrollTo.min.js') }}"></script>
	<script src="{{ asset('/js/d3.min.js') }}"></script>
	<script src="{{ asset('/js/d3.tip.min.js') }}"></script>
	<script src="{{ asset('/js/nouislider.min.js') }}"></script>
	<script src="{{ asset('/js/all.js') }}"></script>




</head>
<body class="{{$hasTopMenu}}" data-js="{{$dataJs or ''}}" data-pagecount="{{$pagecount or ''}}" data-bid="{{$bid or ''}}" data-issue="{{$issue or ''}}" data-documentid="{{$documentId or ''}}" data-type="{{$type or ''}}" data-provenance="{{$provenance or ''}}">
	@include('searchmenu')
	<div id="content">@yield('content')</div>	
	@include('helpwrapper')
	@include('screenwrapper')
	<i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
</body>
</html>
