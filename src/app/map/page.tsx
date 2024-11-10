'use client';

import React, { useEffect, useRef, useState } from 'react';
import Sidebar from '../components/Sidebar';
import mapboxgl, { Map } from 'mapbox-gl';

import 'mapbox-gl/dist/mapbox-gl.css';

const MapboxExample = () => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<Map | null>(null);
    const [coord, setCoord] = useState<[number, number][]>([]);
    const [count, setCount] = useState<number>(0);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [radius, setRadius] = useState(50); // Store the radius

    const [sample, setSample] = useState<number[][]>([
        [-74.0060, 40.7128],   // Center of NYC (Manhattan)
        [-73.935242, 40.730610], // Brooklyn
        [-73.9855, 40.7580],     // Times Square (Midtown)
        [-73.985428, 40.748817], // Empire State Building
        [-74.044502, 40.689247], // Statue of Liberty (Lower Manhattan)
        [-73.9733, 40.7580],     // Central Park South
        [-73.8985, 40.6595],     // Queens
        [-73.9626, 40.8075],     // Morningside Heights (Upper West Side)
        [-73.9574, 40.6426],     // Gowanus (Brooklyn)
        [-73.9427, 40.6895],     // Red Hook, Brooklyn
        [-73.9805, 40.7347],     // Greenwich Village
        [-73.9980, 40.7489],     // Flatiron District
        [-73.9765, 40.7870],     // Upper West Side (Riverside Park)
        [-74.0101, 40.7075],     // Financial District (Wall Street)
        [-73.9816, 40.7557],     // Madison Square Garden (Midtown)
        [-73.9442, 40.6782],     // Brooklyn (Bed-Stuy)
        [-73.9614, 40.7608],     // Midtown West
        [-73.9237, 40.6774],     // East New York, Brooklyn
        [-73.9860, 40.6921],     // Brooklyn Heights
        [-73.9601, 40.7990],     // Manhattanville
        [-73.9338, 40.6735],     // East New York, Brooklyn
        [-73.9149, 40.6339],     // Queens Village
        [-73.9511, 40.7654],     // Lincoln Center Area (Upper West Side)
        [-73.9428, 40.6871],     // Carroll Gardens (Brooklyn)
        [-73.9985, 40.7425],     // Chelsea
        [-73.9908, 40.7419],     // Meatpacking District (West Village)
        [-73.9782, 40.7122],     // SoHo
        [-73.9481, 40.7282],     // Astoria (Queens)
        [-73.9748, 40.7655],     // Upper West Side (Columbia University)
        [-73.9850, 40.7203],     // Chinatown
        [-73.9264, 40.7811],     // Midtown South
        [-73.9445, 40.6782],     // Brownsville (Brooklyn)
        [-73.9470, 40.7167],     // Sunset Park (Brooklyn)
        [-73.9932, 40.7392],     // Flatiron District
        [-73.9612, 40.7736],     // Upper West Side (Riverside Park)
        [-73.9513, 40.7383],     // Brooklyn Heights
        [-73.9771, 40.7515],     // NoMad (Midtown)
        [-73.9060, 40.7368],     // Bushwick (Brooklyn)
        [-73.9431, 40.6857],     // Crown Heights (Brooklyn)
        [-74.0015, 40.7428],     // Gramercy Park
        [-74.0168, 40.7057],     // Seaport District (Lower Manhattan)
        [-74.0149, 40.7572],     // Midtown (Hells Kitchen)
        [-73.9578, 40.7431],     // Long Island City (Queens)
        [-73.9708, 40.7891],     // Central Park North
        [-74.0032, 40.7365],     // West Village (Greenwich Village)
        [-73.9807, 40.7356],     // West Village (Chelsea)
        [-73.9904, 40.7245],     // SoHo
        [-73.9311, 40.7312],     // Astoria, Queens
        [-74.0140, 40.7040],     // Financial District (Wall Street)
        [-73.9742, 40.7587],     // Broadway (Midtown)
        [-73.9953, 40.7423],     // Tribeca (Lower Manhattan)
        [-73.9472, 40.6901],     // Brooklyn (Red Hook)
        [-73.9330, 40.7023],     // Greenpoint (Brooklyn)
        [-73.9397, 40.7468],     // Williamsburg (Brooklyn)
        [-74.0121, 40.7231],     // Chinatown
        [-73.9790, 40.7579],     // Herald Square
        [-73.9671, 40.7762],     // Upper East Side
        [-73.9549, 40.7344],     // Upper West Side (Central Park West)
        [-73.9530, 40.7420],     // Long Island City (Queens)
        [-73.9894, 40.7030],     // DUMBO (Brooklyn)
        [-73.9553, 40.7120],     // Williamsburg Bridge (Brooklyn)
        [-73.9376, 40.6931],     // Brooklyn Heights
        [-73.9813, 40.7394],     // Midtown (Hudson Yards)
        [-73.9369, 40.6770],     // Bushwick (Brooklyn)
        [-73.9627, 40.7558],     // NoMad (Flatiron)
        [-73.9406, 40.7584],     // East Williamsburg (Brooklyn)
        [-73.9486, 40.7158],     // Queensbridge (Queens)
        [-74.0048, 40.7329],
    ]);


    // Function to convert degrees to radians
    const toRadians = (degrees: number) => {
        return degrees * (Math.PI / 180);
    };

    // Haversine formula to calculate distance in miles
    const haversineDistance = (
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number
    ): number => {
        const R = 3959; // Radius of the Earth in miles
        const deltaLat = toRadians(Math.abs(lat2 - lat1));
        const deltaLon = toRadians(Math.abs(lon2 - lon1));
        const a =
            Math.sin(deltaLat / 2) ** 2 +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(deltaLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in miles
    };

    // Function to filter points by radius
    const filterPointsByRadius = (
        currentLocation: number[],
        points: number[][],
        radius: number
    ) => {
        return points.filter(point => {
            const distance = haversineDistance(
                currentLocation[0],
                currentLocation[1],
                point[0],
                point[1]
            );
            return distance <= radius; // Include points within the radius
        })
    };

    // const currentLocation = { lat: 40.730610, lon: -73.935242 }; // Example: New York City coordinates
    // const points = [
    //     { lat: 40.730610, lon: -73.935242 }, // Same location
    //     { lat: 40.748817, lon: -73.985428 }, // Empire State Building
    //     { lat: 40.730825, lon: -73.997332 }, // Nearby point
    //     { lat: 40.689247, lon: -74.044502 }, // Statue of Liberty
    //     { lat: 40.706192, lon: -74.017254 }, // Lower Manhattan
    // ];

    const getRouteFromOSRM = async (sample: number[][]) => {
        // Format the coordinates for the OSRM API request

        const coordsString = sample.sort().slice(0, 10).map(coord => coord.join(',')).join(';');
        const osrmUrl = `http://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=geojson`;

        try {
            const response = await fetch(osrmUrl);
            const data = await response.json();

            if (data.routes && data.routes[0]) {
                setCoord(data.routes[0].geometry.coordinates)
                setCount(() => count + 1)
            } else {
                console.log('No route found');
            }
        } catch (error) {
            console.error('Error fetching route from OSRM:', error);
            return null;
        }
    };
    // const coordinates = [
    //   [40.7128, -74.0060],  // Starting point
    //   [40.730610, -73.935242], // Another point
    //   [40.748817, -73.985428], // Another point
    //   [40.7128, -74.0060],  // Back to starting point to form a loop
    // ];

    useEffect(() => {
        console.log(count);
        if (count == 0) {
            setSample(filterPointsByRadius([40.712776, -74.005974], sample, radius));
            getRouteFromOSRM(sample)
        }
        mapboxgl.accessToken =
            'pk.eyJ1IjoiYXl1c2htYW5zYXRwYXRoeSIsImEiOiJjbTNiYjRoeGYxZnQyMnFwdTVzcTY5OTlyIn0.CP7ih_WcmOtuuDTkicZoNQ';

        if (mapContainerRef.current) {
            mapRef.current = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [-73.9857, 40.7580], // Centered on New York City
                zoom: 12
            });

            mapRef.current.on('load', () => {
                if (mapRef.current) {
                    // Generate a set of coordinates for New York City using a loop
                    console.log(sample)

                    // Add the GeoJSON source for the route with the generated coordinates
                    mapRef.current.addSource('route', {
                        type: 'geojson',
                        data: {
                            type: 'Feature',
                            properties: {},
                            geometry: {
                                type: 'LineString',
                                coordinates: coord.slice(-radius * 2)
                            }
                        }
                    });

                    // Add the 'route' layer to the map
                    mapRef.current.addLayer({
                        id: 'route',
                        type: 'line',
                        source: 'route',
                        layout: {
                            'line-join': 'round',
                            'line-cap': 'round'
                        },
                        paint: {
                            'line-color': '#ff0000',
                            'line-width': 5
                        }
                    });
                }
            });
        }

        return () => {
            mapRef.current?.remove();
        };
    }, [coord, radius, sample]);

    return (
        <div
            ref={mapContainerRef}
            className="map-container h-screen z-2"
        >
            <Sidebar setRadius={setRadius} />
        </div>
    );
};

export default MapboxExample;
