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
        [-73.9857, 40.7580], // Times Square
        [-73.9712, 40.7831], // Central Park
        [-73.9857, 40.7484], // Empire State Building
        [-73.9969, 40.7061], // Brooklyn Bridge
        [-74.0445, 40.6892]
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
        const deltaLat = toRadians(lat2 - lat1);
        const deltaLon = toRadians(lon2 - lon1);
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
        });
    };

    // Example Usage
    useEffect(() => {
        setSample(filterPointsByRadius([40.712776, -74.005974], sample, radius));
    }, [radius])

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
        const coordsString = sample.map(coord => coord.join(',')).join(';');
        const osrmUrl = `http://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=geojson`;

        try {
            const response = await fetch(osrmUrl);
            const data = await response.json();

            if (data.routes && data.routes[0]) {
                setCoord(data.routes[0].geometry.coordinates)
                setCount(() => count + 1)
                console.log(coord)
                console.log(data.routes[0].geometry.coordinates)
            } else {
                console.error('No route found');
                return null;
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

        if (count == 0) {
            getRouteFromOSRM(sample)
        }

        if (mapContainerRef.current) {
            mapRef.current = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [-73.9857, 40.7580], // Centered on New York City
                zoom: 13
            });

            mapRef.current.on('load', () => {
                if (mapRef.current) {
                    // Generate a set of coordinates for New York City using a loop
                    console.log(coord)

                    // Add the GeoJSON source for the route with the generated coordinates
                    mapRef.current.addSource('route', {
                        type: 'geojson',
                        data: {
                            type: 'Feature',
                            properties: {},
                            geometry: {
                                type: 'LineString',
                                coordinates: coord
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
                            'line-width': 8
                        }
                    });
                }
            });
        }

        return () => {
            mapRef.current?.remove();
        };
    }, [coord]);

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
