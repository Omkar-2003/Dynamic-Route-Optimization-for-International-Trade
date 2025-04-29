declare const GetCo2Tender: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly fromLocode: {
                    readonly default: "FRMRS";
                    readonly type: "string";
                    readonly examples: readonly ["FRMRS"];
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "The UNLOCODE of the departure port.";
                };
                readonly toLocode: {
                    readonly default: "HKHKG";
                    readonly type: "string";
                    readonly examples: readonly ["HKHKG"];
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "The UNLOCODE of the arrival port.";
                };
                readonly carrierScac: {
                    readonly type: "string";
                    readonly examples: readonly ["CMDU"];
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "The Standard Carrier Alpha Code (SCAC) of the carrier. Note that you must provide either a SCAC or a carrier id.";
                };
                readonly carrierId: {
                    readonly default: 21;
                    readonly type: "number";
                    readonly examples: readonly [21];
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "The id of the carrier (can be found via the search endpoints). Note that you must provide either a SCAC or a carrier id.";
                };
                readonly nContainers: {
                    readonly default: 1;
                    readonly type: "number";
                    readonly examples: readonly [2.5];
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "The number of shipped containers.";
                };
                readonly containerSizeTypeCode: {
                    readonly type: "string";
                    readonly examples: readonly ["20GP"];
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Code to identify the size and the type of the container. 20GP, 22G1, 2200, 22G0, 2202, 2210, 40GP, 42G1, 42G0, 40G1, 40HC, 45G1, 4500, 45G0, 22R1, 2231, 42R1, 4531, 40NOR, 45R1, 45R8, 40REHC, 53GP.";
                };
                readonly weight: {
                    readonly type: "number";
                    readonly examples: readonly [8000];
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "The weight of shipped goods in kilograms in case the number of containers is unknown.";
                };
            };
            readonly required: readonly ["fromLocode", "toLocode"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "400": {
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "404": {
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const GetItineraryByHash: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly hash: {
                    readonly default: "Ela_kbYVccv69lzdVROOj1pinC-WSPR8kDx_jhW-9fA=";
                    readonly type: "string";
                    readonly examples: readonly ["Ela_kbYVccv69lzdVROOj1pinC-WSPR8kDx_jhW-9fA="];
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "The hash of the itinerary to retrieve.";
                };
            };
            readonly required: readonly ["hash"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "400": {
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const GetPlanSeaRoute: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly coordinates: {
                    readonly default: "9.965629577636719,53.53296196255539;0.45069694519042963,51.503039451809734";
                    readonly type: "string";
                    readonly examples: readonly ["9.965629577636719,53.53296196255539;0.45069694519042963,51.503039451809734"];
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "A list of `longitude,latitude` pairs, separated by `;`. Longitude should be between -180 and 180 degrees, and latitude between -90 and 90 degrees.";
                };
            };
            readonly required: readonly ["coordinates"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly continuousCoordinates: {
                    readonly type: "boolean";
                    readonly default: true;
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Allows to return either continuous longitudes when crossing the antimeridian (`true`) or longitudes always between -180° and 180° (`false`)";
                };
                readonly allowIceAreas: {
                    readonly type: "boolean";
                    readonly default: false;
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Specifies if sailing in ice areas (Northern Sea route, deep South Pacific, deep South Atlantic, Bering Sea, etc) is possible.";
                };
                readonly avoidHRA: {
                    readonly type: "boolean";
                    readonly default: false;
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Specifies if travel in HRA zone should be avoided";
                };
                readonly avoidSeca: {
                    readonly type: "boolean";
                    readonly default: false;
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Specifies if travel in SECA zones should be avoided";
                };
                readonly blockAreas: {
                    readonly type: "integer";
                    readonly examples: readonly [11112];
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Specifies a particular area to block, or a list of areas to block (separated by `,`). Area Ids can be found using the [/geocoding/area/{name}](#operation/getGeocodingArea) endpoint.";
                };
                readonly departure: {
                    readonly type: "integer";
                    readonly examples: readonly [1570095939000];
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Specifies departure time in unix time in ms.";
                };
                readonly imo: {
                    readonly type: "integer";
                    readonly examples: readonly [9776418];
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "The IMO number of the vessel.";
                };
                readonly speed: {
                    readonly type: "number";
                    readonly examples: readonly [42];
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "The speed of the vessel in km/h.";
                };
                readonly speedInKts: {
                    readonly type: "number";
                    readonly examples: readonly [23.5];
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "The speed of the vessel in knots.";
                };
                readonly vesselDraft: {
                    readonly type: "number";
                    readonly examples: readonly [17];
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "The draft of the vessel in meters.";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly description: "GeoJSon object\nThe coordinate reference system for all GeoJSON coordinates is a geographic coordinate reference system, using the World Geodetic System 1984 (WGS 84) datum, with longitude and latitude units of decimal degrees. This is equivalent to the coordinate reference system identified by the Open Geospatial Consortium (OGC) URN An OPTIONAL third-position element SHALL be the height in meters above or below the WGS 84 reference ellipsoid. In the absence of elevation values, applications sensitive to height or depth SHOULD interpret positions as being at local ground or sea level.\n";
            readonly type: "object";
            readonly properties: {
                readonly type: {
                    readonly type: "string";
                    readonly enum: readonly ["Feature", "FeatureCollection", "Point", "MultiPoint", "LineString", "MultiLineString", "Polygon", "MultiPolygon", "GeometryCollection"];
                    readonly description: "`Feature` `FeatureCollection` `Point` `MultiPoint` `LineString` `MultiLineString` `Polygon` `MultiPolygon` `GeometryCollection`";
                };
                readonly bbox: {
                    readonly description: "A GeoJSON object MAY have a member named \"bbox\" to include information on the coordinate range for its Geometries, Features, or FeatureCollections. The value of the bbox member MUST be an array of length 2*n where n is the number of dimensions represented in the contained geometries, with all axes of the most southwesterly point followed by all axes of the more northeasterly point. The axes order of a bbox follows the axes order of geometries.\n";
                    readonly type: "array";
                    readonly items: {
                        readonly type: "number";
                    };
                };
            };
            readonly required: readonly ["type"];
            readonly discriminator: {
                readonly propertyName: "type";
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "400": {
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "404": {
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const GetSeaRoute: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly coordinates: {
                    readonly default: "9.965629577636719,53.53296196255539;0.45069694519042963,51.503039451809734";
                    readonly type: "string";
                    readonly examples: readonly ["9.965629577636719,53.53296196255539;0.45069694519042963,51.503039451809734"];
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "A list of `longitude,latitude` pairs, separated by `;`. Longitude should be between -180 and 180 degrees, and latitude between -90 and 90 degrees.";
                };
            };
            readonly required: readonly ["coordinates"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly continuousCoordinates: {
                    readonly type: "boolean";
                    readonly default: true;
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Allows to return either continuous longitudes when crossing the antimeridian (`true`) or longitudes always between -180° and 180° (`false`)";
                };
                readonly allowIceAreas: {
                    readonly type: "boolean";
                    readonly default: false;
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Specifies if sailing in ice areas (Northern Sea route, deep South Pacific, deep South Atlantic, Bering Sea, etc) is possible.";
                };
                readonly avoidHRA: {
                    readonly type: "boolean";
                    readonly default: false;
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Specifies if travel in HRA zone should be avoided";
                };
                readonly avoidSeca: {
                    readonly type: "boolean";
                    readonly default: false;
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Specifies if travel in SECA zones should be avoided";
                };
                readonly blockAreas: {
                    readonly type: "integer";
                    readonly examples: readonly [11112];
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Specifies a particular area to block, or a list of areas to block (separated by `,`). Area Ids can be found using the [/geocoding/area/{name}](#operation/getGeocodingArea) endpoint.";
                };
                readonly departure: {
                    readonly type: "integer";
                    readonly examples: readonly [1570095939000];
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Specifies departure time in unix time (in ms).";
                };
                readonly imo: {
                    readonly type: "integer";
                    readonly examples: readonly [9776418];
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "The IMO number of the vessel.";
                };
                readonly speed: {
                    readonly type: "number";
                    readonly examples: readonly [42];
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "The speed of the vessel in km/h.";
                };
                readonly speedInKts: {
                    readonly type: "number";
                    readonly examples: readonly [23.5];
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "The speed of the vessel in knots.";
                };
                readonly vesselDraft: {
                    readonly type: "number";
                    readonly examples: readonly [17];
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "The draft of the vessel in meters.";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly description: "GeoJSon object\nThe coordinate reference system for all GeoJSON coordinates is a geographic coordinate reference system, using the World Geodetic System 1984 (WGS 84) datum, with longitude and latitude units of decimal degrees. This is equivalent to the coordinate reference system identified by the Open Geospatial Consortium (OGC) URN An OPTIONAL third-position element SHALL be the height in meters above or below the WGS 84 reference ellipsoid. In the absence of elevation values, applications sensitive to height or depth SHOULD interpret positions as being at local ground or sea level.\n";
            readonly type: "object";
            readonly properties: {
                readonly type: {
                    readonly type: "string";
                    readonly enum: readonly ["Feature", "FeatureCollection", "Point", "MultiPoint", "LineString", "MultiLineString", "Polygon", "MultiPolygon", "GeometryCollection"];
                    readonly description: "`Feature` `FeatureCollection` `Point` `MultiPoint` `LineString` `MultiLineString` `Polygon` `MultiPolygon` `GeometryCollection`";
                };
                readonly bbox: {
                    readonly description: "A GeoJSON object MAY have a member named \"bbox\" to include information on the coordinate range for its Geometries, Features, or FeatureCollections. The value of the bbox member MUST be an array of length 2*n where n is the number of dimensions represented in the contained geometries, with all axes of the most southwesterly point followed by all axes of the more northeasterly point. The axes order of a bbox follows the axes order of geometries.\n";
                    readonly type: "array";
                    readonly items: {
                        readonly type: "number";
                    };
                };
            };
            readonly required: readonly ["type"];
            readonly discriminator: {
                readonly propertyName: "type";
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "400": {
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "404": {
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const GetVesselEta: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly imo: {
                    readonly default: 9776418;
                    readonly type: "integer";
                    readonly examples: readonly [9776418];
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "The IMO number of the vessel.";
                };
            };
            readonly required: readonly ["imo"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "400": {
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "404": {
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "503": {
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const GetWeatherForecast: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly latitude: {
                    readonly type: "number";
                    readonly examples: readonly [17.152];
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Latitude\n";
                };
                readonly longitude: {
                    readonly type: "number";
                    readonly examples: readonly [-80.564];
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Longitude\n";
                };
                readonly timestamp: {
                    readonly type: "number";
                    readonly examples: readonly [1590429600000];
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Unix timestamp, in milliseconds\n";
                };
                readonly timeframe: {
                    readonly type: "number";
                    readonly examples: readonly [21600000];
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Time window, in milliseconds\n";
                };
            };
            readonly required: readonly ["latitude", "longitude", "timestamp"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "400": {
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const PostWeather: {
    readonly body: {
        readonly description: "GeoJSon object\nThe coordinate reference system for all GeoJSON coordinates is a geographic coordinate reference system, using the World Geodetic System 1984 (WGS 84) datum, with longitude and latitude units of decimal degrees. This is equivalent to the coordinate reference system identified by the Open Geospatial Consortium (OGC) URN An OPTIONAL third-position element SHALL be the height in meters above or below the WGS 84 reference ellipsoid. In the absence of elevation values, applications sensitive to height or depth SHOULD interpret positions as being at local ground or sea level.\n";
        readonly type: "object";
        readonly properties: {
            readonly type: {
                readonly type: "string";
                readonly enum: readonly ["Feature", "FeatureCollection", "Point", "MultiPoint", "LineString", "MultiLineString", "Polygon", "MultiPolygon", "GeometryCollection"];
            };
            readonly bbox: {
                readonly description: "A GeoJSON object MAY have a member named \"bbox\" to include information on the coordinate range for its Geometries, Features, or FeatureCollections. The value of the bbox member MUST be an array of length 2*n where n is the number of dimensions represented in the contained geometries, with all axes of the most southwesterly point followed by all axes of the more northeasterly point. The axes order of a bbox follows the axes order of geometries.\n";
                readonly type: "array";
                readonly items: {
                    readonly type: "number";
                };
            };
        };
        readonly required: readonly ["type"];
        readonly discriminator: {
            readonly propertyName: "type";
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
export { GetCo2Tender, GetItineraryByHash, GetPlanSeaRoute, GetSeaRoute, GetVesselEta, GetWeatherForecast, PostWeather };
