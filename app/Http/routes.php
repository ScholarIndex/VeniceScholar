<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', 'MainController@search');
Route::get('/about', 'MainController@about');
Route::get('/statistics', 'MainController@statistics');
Route::get('/venetica', 'MainController@venetica');

Route::get('/lastSearch', 'MainController@lastSearch');
Route::post('/countResult', 'MainController@searchCount');
Route::post('/yearChart', 'MainController@yearChart');
Route::post('/search', 'MainController@searchPost');
Route::post('/filters', 'MainController@filters');
Route::post('/details/{resultType}', 'MainController@details');
Route::post('/smalldetails/{resultType}', 'MainController@smalldetails');
Route::post('/europeana', 'MainController@europeana');
Route::post('/europeanaMore', 'MainController@europeanaMore');
Route::post('/venetica/apiquery', 'MainController@veneticaApiquery');
Route::post('/refs', 'MainController@refs');
Route::get('/author/publications/csv/{aid}', 'MainController@authorPublicationCSV');
Route::get('/{resultType}/{type}/csv/{mid}', 'MainController@citationsCSV');

Route::post('/suggester', 'MainController@suggester');

Route::post('/logaction', 'MainController@logaction');
#Route::group(['middleware' => 'auth'], function () {

	Route::get('/search', 'MainController@search');
	Route::get('/results', 'MainController@results');
	
#});

// Authentication routes...
Route::get('auth/login', 'Auth\AuthController@getLogin');
Route::post('auth/login', 'Auth\AuthController@postLogin');
Route::get('auth/logout', 'Auth\AuthController@getLogout');

// Registration routes...
Route::get('auth/register', 'Auth\AuthController@getRegister');
Route::post('auth/register', 'Auth\AuthController@postRegister');

// Password reset link request routes...
Route::get('password/email', 'Auth\PasswordController@getEmail');
Route::post('password/email', 'Auth\PasswordController@postEmail');

// Password reset routes...
Route::get('password/reset/{token}', 'Auth\PasswordController@getReset');
Route::post('password/reset', 'Auth\PasswordController@postReset');

Route::get('error/{code}', 'MainController@error');

