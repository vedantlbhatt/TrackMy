//
//  Report.swift
//  Track My
//
//  Created by Vedant Bhatt on 6/27/25.
//

import Foundation

public class Report {
    public var name: String
    public var description: String
    public var createdAt: Date
    public var lastLocation: [SavedLocation] = []
    
    public init(name: String, description: String, createdAt: Date = Date(), updatedAt: Date = Date(), lastLocation: [SavedLocation] = []) {
        self.name = name
        self.description = description
        self.createdAt = createdAt
        self.lastLocation = lastLocation
    }
    
}
