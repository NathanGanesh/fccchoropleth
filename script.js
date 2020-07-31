(async () => {
	try {
		const usEducation = await d3.json(
			'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'
		);

		let usCountry = await d3.json(
			'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'
		);

		let usCountryGeoJson = topojson.feature(usCountry, usCountry.objects.counties).features;

		console.log(usCountryGeoJson);

		let canvas = d3.select('#canvas');

		canvas
			.selectAll('path')
			.data(usCountryGeoJson)
			.enter()
			.append('path')
			.attr('d', d3.geoPath())
			.attr('class', 'county')
			.attr('fill', (item) => {
				let id = item['id'];
				let county = usEducation.find((county) => {
					return county['fips'] === id;
				});
				let percentage = county['bachelorsOrHigher'];
				if (percentage <= 15) {
					return 'tomato';
				} else if (percentage <= 30) {
					return 'orange';
				} else if (percentage <= 45) {
					return 'lightgreen';
				} else {
					return 'limegreen';
				}
			})
			.attr('data-fips', (d) => {
				return d['id'];
			})
			.attr('data-education', (d) => {
				let id = d['id'];
				let county = usEducation.find((county) => {
					return county['fips'] === id;
				});
				return county['bachelorsOrHigher'];
			})
			.on('mouseover', (countyDataItem) => {
				tooltip.transition().style('visibility', 'visible');

				let fips = countyDataItem['id'];
				let county = usEducation.find((county) => {
					return county['fips'] === fips;
				});

				tooltip.text(
					county['fips'] +
						' - ' +
						county['area_name'] +
						', ' +
						county['state'] +
						' : ' +
						county['bachelorsOrHigher'] +
						'%'
				);
			})
			.on('mouseout', (countyDataItem) => {
				tooltip.transition().style('visibility', 'hidden');
			});
		let tooltip = d3.select('#tooltip');
	} catch (error) {
		console.log(error);
	}
})();
