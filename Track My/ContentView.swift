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
        }
        .padding()
    }
}


#Preview {
    ContentView()
}
