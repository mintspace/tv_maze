/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */

function isImageNull(image) {
	 return (image === null ? 'https://tinyurl.com/tv-missing' : image.original);
}

async function searchShows(query) {
	// TODO: Make an ajax request to the searchShows api.  Remove
	// hard coded data.

	const qData = await axios.get(`http://api.tvmaze.com/search/shows?q=${query}`)
	let movieArr = [];

	for (let i = 0; i < qData.data.length; i++) {
		let imageNew = isImageNull(qData.data[i].show.image);
		movieArr.push(
			{
				id: qData.data[i].show.id,
				name: qData.data[i].show.name,
				summary: qData.data[i].show.summary,
				image: imageNew
			}
		);
	}
	return movieArr;
}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
	const $showsList = $("#shows-list");
	$showsList.empty();

	for (let show of shows) {
		let $item = $(
			`<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
				<div class="card" data-show-id="${show.id}">
					<img class="card-img-top" src="${show.image}" alt="">
					<div class="card-body">
						<h5 class="card-title">${show.name}</h5>
						<p class="card-text">${show.summary}</p>
						<button class="btn btn-primary event-btn" show-id="${show.id}">Episodes</button>
					</div>
				</div>
			</div>
			`);
		$showsList.append($item);
	}
}

function btnEevent() {
	$('.event-btn').on('click', async function(e) {
		e.preventDefault();
		let id = $(this).attr("show-id");
		let epi = await getEpisodes(id);
		populateEpisodes(epi)
	})
}

async function populateEpisodes(episodes) {
	const $episodesList = $("#episodes-list");
	$episodesList.empty();
	for (let episode of episodes) {
		let $item = $(
			`<li>${episode.name} (season ${episode.season}, number ${episode.number})</li>`
		)
		$episodesList.append($item);
	}
	$("#episodes-area").show();
}

/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch(evt) {
	evt.preventDefault();
	let query = $("#search-query").val();
	if (!query) return;

	$("#episodes-area").hide();

	let shows = await searchShows(query);
	populateShows(shows);
	btnEevent();
});

/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
	// TODO: get episodes from tvmaze
	//       you can get this by making GET request to
	//       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes
	const qEpisodes = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`)
	let spisodeArr = [];
	for (let episode of qEpisodes.data) {
		spisodeArr.push(
			{
				id: episode.id,
				name: episode.name,
				season: episode.season,
				number: episode.number
			}
		)
	}
	return spisodeArr;
	// TODO: return array-of-episode-info, as described in docstring above
}
