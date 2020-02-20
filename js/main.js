$(document).ready(function () {
	var SEARCH_RESULTS_PER_PAGE = 10;
	var CURRENT_RESULTS_PAGE = 1;
	var SEARCH_URL = '';

	var createMovieElement = function (movie) {
		return '<li class="collection-item search-results-item"><span class="search-movie-title">'+movie.Title+'</span><button data-movie-id="' + movie.imdbID + '" class="waves-effect waves-light btn show-info-btn" type="button">info</button></li>';
	};

	var createPaginationForResults = function (resultsCount, url) {
		var buttonsCount = Math.ceil(parseInt(resultsCount, 10) / SEARCH_RESULTS_PER_PAGE);
		var searchResultsPagination = $('.search-results-pagination');
		searchResultsPagination.html('');

		for (var i = 1; i <= buttonsCount; i++) {
			searchResultsPagination.append('<li class="waves-effect"><a class="text-white" href="' + url + '&page=' + i + '">' + i + '</a></li>');
		}
	};

	var showResults = function (response) {
		if (!response.Search) {
			alert('Not found please find another movie');
			return;
		}

		var elSearchResults = $('.search-results');
		elSearchResults.html('');

		response.Search.forEach(function (movie) {
			elSearchResults.append(createMovieElement(movie));
		});
		elSearchResults.removeClass('hide');

		createPaginationForResults(response.totalResults, SEARCH_URL);
	};

	var showMovieInfo = function (movieId) {
		$.ajax({
			method: 'GET',
			dataType: 'json',
			url: 'https://www.omdbapi.com/?apikey=249e8962&i=' + movieId,
			success: function (response) {
				var movieInfoCard = $('.movie-info-card');
				movieInfoCard.find('.movie-poster').attr('src', response.Poster);
				movieInfoCard.find('.movie-poster').attr('alt', response.Title + ' poster');
				movieInfoCard.find('.movie-title').text(response.Title);
				movieInfoCard.find('.movie-plot').text(response.Plot);

				movieInfoCard.removeClass('hide');
			}
		});
	};

	$('.search-results').on('click', '.show-info-btn', function () {
		showMovieInfo($(this).data('movie-id'));
	});

	$('.search-results-pagination').on('click', 'a', function (evt) {
		evt.preventDefault();
		var link = $(this).attr('href');

		$.ajax({
			method: 'GET',
			dataType: 'json',
			url: link,
			success: showResults
		});
	});

	$('.search-form').on('submit', function (evt) {
		
		SEARCH_URL = $(this).attr('action') + $(this).find('.search-input').val();

		
		$.ajax({
			method: 'GET',
			dataType: 'json',
			url: SEARCH_URL,
			success: showResults
		});
	});
});