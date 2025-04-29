// // const PDFDocument = require('pdfkit');
// // const doc = new PDFDocument;
// // const fs=require('fs');
// // const path = require('path'); // Import the path module

// // // const img = require('../Input/download3.jpeg');
// // // const fs=require('../Input/');

// // // index.js

// // // Importing modules
// // // import PDFDocument from 'pdfkit'
// // // import fs from 'fs'

// // // Create a document

// // const PdfCreator=async (req,res) =>{

// // try {
// // const doc = new PDFDocument();

// // // Saving the pdf file in root directory.
// // // doc.pipe(fs.createWriteStream('../pdf_data/example.pdf'));
// // const outputPath = path.join(__dirname, '..', 'pdf_data', 'example.pdf');

// // // Pipe the PDF to the response
// // doc.pipe(fs.createWriteStream(outputPath));

// // // Adding functionality
// // doc
// // 	.fontSize(27)
// // 	.text('This the article for GeeksforGeeks', 100, 100);

// // // Adding an image in the pdf.

// // // doc.image(fs.readFile('../Input/download3.jpeg'), {
// // // 	fit: [300, 300],
// // // 	align: 'center',
// // // 	valign: 'center'
// // // });
// //         // Specify the correct path for the input image file
// //         const imagePath = path.join(__dirname, '..', 'Input', req.file.file);
        
// //         // Read the image file asynchronously
// //         const imageData = await new Promise((resolve, reject) => {
// //             fs.readFile(imagePath, (err, data) => {
// //                 if (err) {
// //                     reject(err);
// //                 } else {
// //                     resolve(data);
// //                 }
// //             });
// //         });

// //         // Add the image to the PDF
// //         doc.image(imageData, {
// //             fit: [300, 300],
// //             align: 'center',
// //             valign: 'center'
// //         });
// // doc
// // 	.addPage()
// // 	.fontSize(15)
// // 	.text('Generating PDF with the help of pdfkit', 100, 100);



// // // Apply some transforms and render an SVG path with the 
// // // 'even-odd' fill rule
// // doc
// // 	.scale(0.6)
// // 	.translate(470, -380)
// // 	.path('M 250,75 L 323,301 131,161 369,161 177,301 z')
// // 	.fill('red', 'even-odd')
// // 	.restore();

// // // Add some text with annotations
// // doc
// // 	.addPage()
// // 	.fillColor('blue')
// // 	.text('The link for GeeksforGeeks website', 100, 100)
// // 	.link(100, 100, 160, 27, 'https://www.geeksforgeeks.org/');

// // // Finalize PDF file
// // doc.end();
// // res.status(200).json({'message':"Success created pdf "});

// // }catch(err){
// //     res.status(500).json({'err':err})
// // }
// // };


// // module.exports={
// //     PdfCreator
// // }



// const PDFDocument = require('pdfkit');
// const fs = require('fs');
// const path = require('path');
// const upload = require('multer')();
// // const fetch = require('node-fetch'); 

// // const multer = require('multer');

// // Set up multer for handling file uploads
// // const upload = multer({ dest: 'uploads/' });

// const PdfCreator = async (req, res) => {
//     try {
//         const doc = new PDFDocument();
         

//         const image_data=req.body.img;
//         const data = req.body.data;
//         console.log(data);     // if(!req.file){
//         //   console.log('File Exists');  
//         //   console.log(req.body.data);
//         //   return res.status(500).json({"message":"error exists"});
//         // }

//         // Specify the output path for the PDF file
//         const outputPath = path.join(__dirname, '..', 'pdf_data', 'example.pdf');
        
//         // Pipe the PDF to the response
//         doc.pipe(fs.createWriteStream(outputPath));

//         // Adding functionality
//         doc.fontSize(27).text('This is the article for GeeksforGeeks', 100, 100);

//         // // Check if a file is uploaded
//         // if (!req.file) {
//         //     return res.status(400).json({ error: 'No file uploaded' });
//         // }

//         // Read the uploaded image file asynchronously
//         // const imageData = image_data;
//         const imageData = await fetchImage(image_data);

//         // // Add the image to the PDF
//         // doc.image(imageData, {
//         //     fit: [300, 300],
//         //     align: 'center',
//         //     valign: 'center'
//         // });
//         // doc.image(image_url, {
//         //     fit: [300, 300],
//         //     align: 'center',
//         //     valign: 'center'
//         // });

//         // Add more content to the PDF
//         doc.addPage().fontSize(15).text(`Generating PDF with the help of pdfkit ${ data}`, 100, 100);
//         doc
//             .scale(0.6)
//             .translate(470, -380)
//             .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
//             .fill('red', 'even-odd')
//             .restore();
//         doc.addPage().fillColor('blue').text('The link for GeeksforGeeks website', 100, 100)
//             .link(100, 100, 160, 27, 'https://www.geeksforgeeks.org/');

//         // Finalize PDF file
//         doc.end();

//         // Respond with success message
//         res.status(200).json({ message: 'PDF successfully created' });
//     } catch (err) {
//         console.error('Error creating PDF:', err);
//         res.status(500).json({ error: 'Failed to create PDF' });
//     }
// };



// // async function fetchImage(image_url) {
// //     try {
// //         const response = await fetch(image_url);
// //         const imageData = await response.buffer(); // Convert response to buffer
// //         return imageData;
// //     } catch (error) {
// //         console.error('Error fetching image:', error);
// //         return null;
// //     }
// // }
// // Route handler for file upload
// // app.post('/generate-pdf', upload.single('file'), PdfCreator);



// // const  PdfCreator = async(req,res)=>{
// // try {
// //    console.log(req.body.data);
// // //    if(req.file){
// // //     console.log('file exists ');
// // //    }
// //    res.status(200).json("working");
// // }catch(err){
// //     console.log(err);
// //     res.status(500).json("Error");
// // }
// // }


// module.exports = {
//     PdfCreator
// };


const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
// const { Munch } = require('munch');


const PdfCreator = async (req, res) => {
    try {
    //     const munchData = new Munch(eval(req.body.data));
    //     const processedData = processData(munchData);


    //     const processData = (data) => {
    //         const binType = data.bin_type;
    //         const pallets = data.array.map(item => {
    //             const palletDim = item.pallet_dim.split(': ')[1];
    //             const palletQuantity = item.pallet_quantity;
    //             return { palletDim, palletQuantity };
    //         });
        
    //         return { binType, pallets };
    //     };
    //   console.log(processedData);
        // const munchData = new Munch(eval(dataString));

        // Process the data
        // const processedData = processData(munchData);
                
        const doc = new PDFDocument();
        // let dataString = JSON.stringify(req.body.data);

        // // Remove unwanted words and characters
        // dataString = dataString.replace(/Munch\(|\)|'/g, '')
        //                        .replace(/pallet_quantity: ,/g, '');
    
        // // Convert the modified string back to an object
        // const modifiedData = JSON.parse(dataString);
    
        // Specify the output path for the PDF file
        const outputPath = path.join(__dirname, '..', 'pdf_data', 'example.pdf');

        // Pipe the PDF to the response
        doc.pipe(fs.createWriteStream(outputPath));
        
        // Add heading
        doc.fontSize(20).text('This is the Pdf about Container Information', { align: 'center' })      
          .fillColor('blue');  // Set text color to blue
        

        doc.moveDown(); // Add default space (1 line)
        doc.moveDown(); // Add default space (1 line)
        doc.moveDown(); // Add default space (1 line)
        doc.moveDown(); // Add default space (1 line)
        doc.moveDown(); // Add default space (1 line)
        doc.moveDown(); // Add default space (1 line)
        doc.moveDown(); // Add default space (1 line)
        doc.moveDown(); // Add default space (1 line)
        doc.moveDown(); // Add default space (1 line)
        doc.moveDown(); // Add default space (1 line)
        doc.moveDown(); // Add default space (1 line)
        doc.moveDown(); // Add default space (1 line)


        // Adding data object
        const dataObject = req.body.data;
        doc.text(`Data Object: ${JSON.stringify(dataObject)}`);

        // Adding image link
        const imageLink = req.body.img;
        // doc.text(`Image Link: ${imageLink}`);
        doc.fontSize(12)
        .fillColor('black')  // Set text color to blue
        .text(`Click here to view the image: ${imageLink} `, { continued: true });
        // .link(imageLink, 0, 12, { underline: false });
        // Adding timestamp
        doc.moveDown(); // Add default space (1 line)
        doc.moveDown(); // doc.moveDown(); //
        const timestamp = new Date().toISOString();
        doc.text(`Timestamp: ${timestamp}`);
        doc.moveDown(); // Add default space (1 line)

        // const shipperID = req.body.shipperid;
        // doc.text(`Shipper ID: ${shipperID}`);
        // doc.moveDown(); // Add default space (1 line)
 
  
        // Adding shipper ID
        const shipperID = req.body.shipperid;
        doc.text(`Shipper ID: ${shipperID}`);
        doc.moveDown(); // Add default space (1 line)
 
        // Finalize PDF file
        doc.end();

        res.status(200).json({ message: 'Success: PDF created' });
    } catch (err) {
        console.error('Error creating PDF:', err);
        res.status(500).json({ error: 'Failed to create PDF' });
    }
};

module.exports = {
    PdfCreator
};


