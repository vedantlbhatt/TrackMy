//
//  ContentView.swift
//  Track My
//
//  Created by Vedant Bhatt on 6/24/25.
//

import SwiftUI
import PhotosUI
import Photos
import MapKit

struct ContentView: View {
    @State var showReportSheet: Bool = false
    var body: some View {
        VStack {
            
            Button(action: {
                showReportSheet.toggle()
            }) {
                Text("Report")
            }
            .sheet(isPresented: $showReportSheet) {
                FileReportView()
            }
            
        }
        .padding()
    }
}
struct FileReportView: View {
    @State private var selectedImages: [PhotosPickerItem] = []
    @State private var uiImages: [UIImage] = []
    @State private var radius: Double = 10000.0
    @State private var position: MapCameraPosition  = MapCameraPosition.camera(MapCamera(centerCoordinate: CLLocationCoordinate2D(latitude: 41.416775, longitude: 2.16), distance: 1000, heading: 0, pitch: 0))
    
    var body: some View {
        VStack {
            
            Text("Enter Details Here")
            
            Button("Add Last Known Location", action: {
                
            })
            
            PhotosPicker(
                selection: $selectedImages,
                maxSelectionCount: 10,
                matching: .images
            ) {
                Text("Pick Images")
            }
            .onChange(of: selectedImages, initial: false) { oldItems, newItems in
                Task {
                    var newUiImages: [UIImage] = []

                    for item in selectedImages {
                        if let data = try? await item.loadTransferable(type: Data.self),
                           let uiImage = UIImage(data: data) {
                            if !newUiImages.contains(where: { $0.pngData() == uiImage.pngData() }) {
                                newUiImages.append(uiImage)
                            }
                        }
                    }
                    await MainActor.run {
                        uiImages = newUiImages
                    }
                }
            }

        
            ScrollView(.horizontal) {
                HStack {
                    ForEach(uiImages, id: \.self) { img in
                        Image(uiImage: img)
                            .resizable()
                            .scaledToFit()
                            .frame(width: 100, height: 100)
                            .cornerRadius(8)
                    }
                }
            }
            
            Map(position: $position) {
                MapCircle(center: CLLocationCoordinate2D(latitude: 41.416775, longitude: 216), radius: radius)
            }
                .frame(minWidth: 50, maxWidth: 350, minHeight: 50, maxHeight: 350, alignment: .bottomTrailing)
                .cornerRadius(50.0)
            
        }
        .padding()
    }
}


#Preview {
    ContentView()
}
