import type * as types from './types';
import type { ConfigOptions, FetchResponse } from 'api/dist/core';
import Oas from 'oas';
import APICore from 'api/dist/core';
declare class SDK {
    spec: Oas;
    core: APICore;
    constructor();
    /**
     * Optionally configure various options that the SDK allows.
     *
     * @param config Object of supported SDK options and toggles.
     * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
     * should be represented in milliseconds.
     */
    config(config: ConfigOptions): void;
    /**
     * If the API you're using requires authentication you can supply the required credentials
     * through this method and the library will magically determine how they should be used
     * within your API request.
     *
     * With the exception of OpenID and MutualTLS, it supports all forms of authentication
     * supported by the OpenAPI specification.
     *
     * @example <caption>HTTP Basic auth</caption>
     * sdk.auth('username', 'password');
     *
     * @example <caption>Bearer tokens (HTTP or OAuth 2)</caption>
     * sdk.auth('myBearerToken');
     *
     * @example <caption>API Keys</caption>
     * sdk.auth('myApiKey');
     *
     * @see {@link https://spec.openapis.org/oas/v3.0.3#fixed-fields-22}
     * @see {@link https://spec.openapis.org/oas/v3.1.0#fixed-fields-22}
     * @param values Your auth credentials for the API; can specify up to two strings or numbers.
     */
    auth(...values: string[] | number[]): this;
    /**
     * If the API you're using offers alternate server URLs, and server variables, you can tell
     * the SDK which one to use with this method. To use it you can supply either one of the
     * server URLs that are contained within the OpenAPI definition (along with any server
     * variables), or you can pass it a fully qualified URL to use (that may or may not exist
     * within the OpenAPI definition).
     *
     * @example <caption>Server URL with server variables</caption>
     * sdk.server('https://{region}.api.example.com/{basePath}', {
     *   name: 'eu',
     *   basePath: 'v14',
     * });
     *
     * @example <caption>Fully qualified server URL</caption>
     * sdk.server('https://eu.api.example.com/v14');
     *
     * @param url Server URL
     * @param variables An object of variables to replace into the server URL.
     */
    server(url: string, variables?: {}): void;
    /**
     * This endpoint returns CO2e emissions (i.e CO2 equivalent emissions) statistics of a
     * given carrier for a given port pair. The CO2e emissions are returned in grams per TEU.
     *
     * The carrier can be given by SCAC or id.
     *
     * We calculate the itineraries operated by the carrier based on their services (and the
     * services of their alliance) and for each itinerary, we calculate the CO2e emissions of
     * each vessel operating the service and return statistics.
     *
     * The response contains CO2e WTW (well-to-wheels) emissions statistics with minimum value
     * (i.e value of the greenest itinerary on average), maximum value (i.e value of the most
     * emitting itinerary on average), average value of all the itineraries and standard
     * deviations.
     * We also provide detailed emissions with TTW (tank-to-wheels) emissions and WTT
     * (well-to-tank) emissions. The method takes into account the emissions caused by the fuel
     * consumption of the main engines, the auxiliary engines and the boilers.
     * The response also returns the intensity factor (kg of CO2 per ton.kilometer) which is
     * calculated based on the CO2e WTW, distance and the weight provided. If no weight has
     * been provided, we estimate the weight based on the number of containers and their type
     * (`weight` in `properties`)
     *
     * The `parameters` field in the response contains all the parameters that were given in
     * the request.
     *
     * The `properties` field in the response gives the details of the CO2 statistics of each
     * itinerary. The statistics of an itinerary are calculated on the vessels so the minimum
     * value is the CO2 emissions of the greenest vessel on the service, etc. In case of an
     * itinerary with transhipments, the minimum value is the sum of the minimum values of each
     * leg of the itinerary.
     *
     * Each itinerary is associated to a unique fingerprint (called "hash") that you can use to
     * retrieve the details of the itinerary via the
     * [/itinerary/v2/hash](#operation/getItineraryByHash) endpoint.
     *
     * Note that the distances we use to calculate CO2 values take into account all the stops
     * in other ports the vessel does on the itinerary based on the service it operates.
     *
     * The itineraries are calculated on up to date carriers services data. In case of a route
     * with transhipments, note that the transhipment ports may not be the one actually
     * operated.
     *
     * The method used to calculate emissions is the one available in our
     * [co2/v2/direct/sea](#operation/getCO2ForVessel) endpoint and is based on the following
     * references :
     * - Third IMO Greenhouse Gas Study 2014;
     * - Fourth IMO Greenhouse Gas Study 2020;
     * - EMEP/EEA air pollutant emission inventory guidebook 2019;
     * - GLEC Framework 2020.
     *
     *
     * @summary Get CO2 statistics for a given carrier on a given port pair.
     * @throws FetchError<400, types.GetCo2TenderResponse400> Bad request
     * @throws FetchError<404, types.GetCo2TenderResponse404> Not found
     */
    getCO2Tender(metadata: types.GetCo2TenderMetadataParam): Promise<FetchResponse<200, types.GetCo2TenderResponse200>>;
    /**
     * This endpoint returns the details about an itinerary by hash (the unique fingerprint
     * used to identify them). Itinerary hashes are returned in
     * [/co2/v2/plan](#operation/getCO2Tender) for example.
     *
     * The response is a feature collection where each feature corresponds to a leg of the
     * itinerary. Each feature has its own properties such as the distance, the duration, the
     * day of departure and arrival, the service id, etc. The feature collection properties are
     * those of the entire itinerary : duration (including transhipments, wait in ports), ids
     * of the carriers that can operate the itinerary, etc.
     *
     * The distances are given in meters and the CO2e emissions in grams per TEU.
     *
     *
     * @summary Get itinerary by hash.
     * @throws FetchError<400, types.GetItineraryByHashResponse400> Bad request
     */
    getItineraryByHash(metadata: types.GetItineraryByHashMetadataParam): Promise<FetchResponse<200, types.GetItineraryByHashResponse200>>;
    /**
     * This endpoints returns the route between a source location and a target location on sea,
     * along with the route distance (in meters), duration (in milliseconds) and the crossed
     * areas. We return the shortest route sailed considering traffic separation schemes and
     * port entries.
     *
     * ### Origin, destination and intermediary points
     *
     * Coordinate pairs are used for positions. They are specified as `longitude,latitude`, and
     * listed with separating `;`. You can specify intermediary points on a route, or request
     * several legs of a trip in one go, by listing more than two coordinate pairs. For
     * instance:
     * `-1.26617431640625,50.79551936692376;8.8330078125,53.88491634606499;-3.2409667968749996,53.50111704294316`.
     *
     * ### Vessel specific routes
     *
     * You can get vessel specific routes by specifying the IMO number of a vessel. The
     * returned route will be compatible with the vessel dimensions (width (in m), length (in
     * m), maximum draft (in m)). If the IMO is not given, We choose a small vessel in order
     * not to block any route.
     * You can also specify the current draft (in m) of the vessel using the parameter
     * `vesselDraft`, with or without giving an IMO. If both IMO and vessel draft are given,
     * the given draft (in m) is used and the other dimensions (width, length) are retrieved
     * from the IMO number.
     * The response contains static information about the vessel used (width (in m), length (in
     * m), maximum draft (in m)).
     *
     * ### Continuous coordinates
     *
     * Depending on the boolean parameter `continuousCoordinates`, the longitudes of the points
     * of the route returned can be between -180° and 180° (`false`) or continuous (ie greater
     * than 180° or lower than -180° after crossing the antimeridian).
     * The default behavior is to return continuous coordinates (the parameter is set to `true`
     * as default). However, we encourage the use of normalized longitudes between -180° and
     * 180° setting the parameter to `true` when requesting a route.
     *
     * ### Routing parameters
     *
     * Departure time (Unix time in ms) and speed can be specified in order to get an accurate
     * ETA. The speed can be given in knots using the parameter `speedInKts` or in km/h using
     * the parameter `speed`. The ETA (Unix time in ms) and duration (in ms) take into account
     * the maximum authorized speed in specific areas such as canals. If the vessel speed is
     * superior to the authorized speed of a crossed area, we assume the vessel will sail at
     * maximum authorized speed in the area and at the given vessel speed outside the area.
     *
     * #### Avoid zones
     *
     * ECA zones can be avoided by using the parameter `avoidSeca`. In that case, the distance
     * travelled in the ECA zone is minimized.
     * The HRA (high risk area) zone can be avoided using parameter `avoidHRA`. If no points
     * from the query are in the HRA zones, the zone will be totally avoided, if at least one
     * point is in the HRA zone, the route will go through it but minimize the distance
     * navigated in it.  The distance in HRA is available in the response in the field
     * `hraIntersection`.
     *
     * #### Ice areas and block areas
     *
     * By default, the seas that are difficult to sail due to the presence of ice are not
     * allowed (for example the Bering Sea, the Northern Sea Route, etc). You can allow the
     * route to go through these zones by using the `allowIceAreas` parameter.
     * It is possible to block some areas by using the parameter `blockAreas` which takes a
     * list of ids (Panama Canal : 11112 , Suez Canal : 11117). In that case, the route won't
     * cross the areas blocked.
     *
     * Note that all rivers are available on this endpoint using appropriate vessel draft (in
     * m).
     *
     *
     * @summary Get sea route between coordinates.
     * @throws FetchError<400, types.GetSeaRouteResponse400> Bad request
     * @throws FetchError<404, types.GetSeaRouteResponse404> Not found
     */
    getSeaRoute(metadata: types.GetSeaRouteMetadataParam): Promise<FetchResponse<200, types.GetSeaRouteResponse200>>;
    /**
     * This endpoints returns the route between a source location and a target location on sea,
     * along with the route distance (in meters), duration (in milliseconds) and details about
     * the zones it goes through. We return the shortest route sailed considering traffic
     * separation schemes and port entries.
     *
     * ### Origin, destination and intermediary points
     *
     * Coordinate pairs are used for positions. They are specified as `longitude,latitude`, and
     * listed with separating `;`. You can specify intermediary points on a route, or request
     * several legs of a trip in one go, by listing more than two coordinate pairs. For
     * instance:
     * `-1.26617431640625,50.79551936692376;8.8330078125,53.88491634606499;-3.2409667968749996,53.50111704294316`.
     *
     * ### Vessel specific routes
     *
     * You can get vessel specific routes by specifying the IMO number of a vessel. The
     * returned route will be compatible with the vessel dimensions (width (in m), length (in
     * m), maximum draft (in m)). If the IMO is not given, We choose a small vessel in order
     * not to block any route.
     * You can also specify the current draft (in m) of the vessel using the parameter
     * `vesselDraft`, with or without giving an IMO. If both IMO and vessel draft are given,
     * the given draft (in m) is used and the other dimensions (width, length) are retrieved
     * from the IMO number.
     * The response contains static information about the vessel used (width (in m), length (in
     * m), maximum draft (in m)).
     *
     * ### Continuous coordinates
     *
     * Depending on the boolean parameter `continuousCoordinates`, the longitudes of the points
     * of the route returned can be between -180° and 180° (`false`) or continuous (ie greater
     * than 180° or lower than -180° after crossing the antimeridian).
     * The default behavior is to return continuous coordinates (the parameter is set to `true`
     * as default). However, we encourage the use of normalized longitudes between -180° and
     * 180° setting the parameter to `true` when requesting a route.
     *
     * ### Routing parameters
     *
     * Departure time (Unix time in ms) and speed can be specified in order to get an accurate
     * ETA. The speed can be given in knots using the parameter `speedInKts` or in km/h using
     * the parameter `speed`. The ETA (Unix time in ms) and duration (in ms) take into account
     * the maximum authorized speed in specific areas such as canals. If the vessel speed is
     * superior to the authorized speed of a crossed area, we assume the vessel will sail at
     * maximum authorized speed in the area and at the given vessel speed outside the area.
     *
     * #### Avoid zones
     *
     * ECA zones can be avoided by using the parameter `avoidSeca`. In that case, the distance
     * travelled in the ECA zone is minimized.
     * The HRA (high risk area) zone can be avoided using parameter `avoidHRA`. If no points
     * from the query are in the HRA zones, the zone will be totally avoided, if at least one
     * point is in the HRA zone, the route will go through it but minimize the distance
     * navigated in it.  The distance in HRA is available in the response in the field
     * `hraIntersection`.
     *
     * #### Ice areas and block areas
     *
     * By default, the seas that are difficult to sail due to the presence of ice are not
     * allowed (for example the Bering Sea, the Northern Sea Route, etc). You can allow the
     * route to go through these zones by using the `allowIceAreas` parameter.
     * It is possible to block some areas by using the parameter `blockAreas` which takes a
     * list of ids (Panama Canal : 11112 , Suez Canal : 11117). In that case, the route won't
     * cross the areas blocked.
     *
     * Note that all rivers are available on this endpoint using appropriate vessel draft (in
     * m).
     *
     * ### Waypoints returned
     *
     * This endpoint additionally returns a list of waypoints of interest in the `waypoints`
     * fields of the `properties` of each leg. The waypoints can be of different types :
     * - `VOYAGE` for voyage scale events such as departure and arrival with class either
     * `ENTRY` or `EXIT`;
     * - `ROUTING` for special zones with class either `ENTRY` or `EXIT`;
     * - `SECA` for ECA zones with class either `ENTRY` or `EXIT`;
     * - `SPEED` for points where speed must be adjusted with class `INCREASE`, `DECREASE` or
     * `TARGET` (only used to know the speed at departure when it must be different than the
     * given speed).
     *
     *
     * @summary Get a detailed plan for sea route between coordinates.
     * @throws FetchError<400, types.GetPlanSeaRouteResponse400> Bad request
     * @throws FetchError<404, types.GetPlanSeaRouteResponse404> Not found
     */
    getPlanSeaRoute(metadata: types.GetPlanSeaRouteMetadataParam): Promise<FetchResponse<200, types.GetPlanSeaRouteResponse200>>;
    /**
     * Retrieve information from AIS and return general information about the vessel, its
     * current speed (in km/h), its current draft (in m), its last position, its destination
     * and an ETA predicted by our algorithms (Unix timestamp in ms).
     *
     *
     * @summary Get vessel ETA by IMO number
     * @throws FetchError<400, types.GetVesselEtaResponse400> Bad request
     * @throws FetchError<404, types.GetVesselEtaResponse404> Not found
     * @throws FetchError<503, types.GetVesselEtaResponse503> AIS service unavailable.
     */
    getVesselEta(metadata: types.GetVesselEtaMetadataParam): Promise<FetchResponse<200, types.GetVesselEtaResponse200>>;
    /**
     * Get forecasted weather information in bulk, at a given location. By default we return
     * weather information every 3 hours for your requested timeframe. If you do not specify a
     * timeframe, we return the full 14 days forecast. The timestamp you pass in your request
     * needs to be after today.
     *
     * All values are expressed in the standard SI units (temperatures in Celcius degrees,
     * humidity, cloud coverage and ice coverage in percentages, pressure in hectopascals,
     * precipitation in millimeters, times in seconds, distances in meters, speeds in meters
     * per second, salinity in PSU).
     *
     *
     * @summary Get Forecasted weather at location
     * @throws FetchError<400, types.GetWeatherForecastResponse400> Bad request
     */
    getWeatherForecast(metadata: types.GetWeatherForecastMetadataParam): Promise<FetchResponse<200, types.GetWeatherForecastResponse200>>;
    /**
     * When using our [`/route/v2/`](#tag/SEA-Route) endpoint, users are returned suggested
     * vessel routes, for a particular vessel and speed, through canals and straight. You can
     * use our `weather/v2/track` endpoint to post the route you obtained from `/route/v2/`, in
     * order to get the weather at each route point. This works both in the past, with
     * historical values, or in the future, with forecasted values.
     *
     * Alternatively, you can form your own GeoJSON object, and post it to our
     * `weather/v2/track` endpoint to obtain weather on your route. A minima, your
     * FeatureCollection should contain at least one Feature, with the properties `departure`
     * and `speed`, and the corresponding geometry. Below an example of such a minimal object:
     * ```json
     * {
     *   "type": "FeatureCollection",
     *   "properties": {},
     *   "features": [
     *       {
     *           "type": "Feature",
     *           "properties": {
     *               "departure": 1581166465000,
     *               "arrival": 1581191106000,
     *               "duration": 24641000,
     *               "speed": 42.0
     *           },
     *           "geometry": {
     *               "type": "LineString",
     *               "coordinates":
     * [[7.294921874999999,54.265224078605684],[3.076171875,54.13669645687002],[-1.318359375,57.9148477670092]]
     *           }
     *       }
     *   ]
     * }
     * ```
     * Note that using our endpoint [`/route/v2/sea/<coords>/plan`](#operation/getPlanSeaRoute)
     * yields the best results, since we cap the vessel speed in canals and straights where
     * there are vessel speed restrictions.
     *
     * All values are expressed in the standard SI units (temperatures in Celcius degrees,
     * humidity, cloud coverage and ice coverage in percentages, pressure in hectopascals,
     * precipitation in millimeters, times in seconds, distances in meters, speeds in meters
     * per second, salinity in PSU).
     *
     *
     * @summary Get weather along a route
     */
    postWeather(body: types.PostWeatherBodyParam): Promise<FetchResponse<200, types.PostWeatherResponse200>>;
}
declare const createSDK: SDK;
export = createSDK;
