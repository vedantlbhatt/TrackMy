//
//  SavedLocation.swift
//  Track My
//
//  Created by Vedant Bhatt on 6/25/25.
//

import Foundation
import MapKit

public class SavedLocation: ObservableObject {
    @Published var centerCoords: CLLocationCoordinate2D?
    @Published var radius: CLLocationDistance?
    
    public init(centerCoords: CLLocationCoordinate2D? = nil, radius: CLLocationDistance? = nil) {
        self.centerCoords = centerCoords
        self.radius = radius
    }
}
