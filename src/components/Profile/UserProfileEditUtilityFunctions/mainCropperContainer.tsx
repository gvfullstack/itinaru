// // import React, { useState } from 'react'
// // import Cropper from 'react-easy-crop'
// // import Slider from '@mui/material/Slider'
// // import Button from '@mui/material/Button'
// // import Typography from '@mui/material/Typography'
// // import { styled, useTheme } from '@mui/system'
// // import ImgDialog from './ImgDialog'
// // import getCroppedImg from './cropImage'
// // import { styleSettings } from './styleSettings'

// // interface ICroppedArea {
// //   x: number
// //   y: number
// //   width: number
// //   height: number
// // }

// // const dogImg =
// //   'https://img.huffingtonpost.com/asset/5ab4d4ac2000007d06eb2c56.jpeg?cache=sih0jwle4e&ops=1910_1000'

// const CropContainer = styled('div')(styleSettings.cropContainer)
// const Controls = styled('div')(styleSettings.controls)
// const SliderContainer = styled('div')(styleSettings.sliderContainer)
// const SliderLabel = styled(Typography)(styleSettings.sliderLabel)
// const StyledSlider = styled(Slider)(styleSettings.slider)
// const CropButton = styled(Button)(styleSettings.cropButton)

// const Demo: React.FC = () => {
// //   const [crop, setCrop] = useState<{ x: number, y: number }>({ x: 0, y: 0 })
// //   const [rotation, setRotation] = useState<number>(0)
// //   const [zoom, setZoom] = useState<number>(1)
// //   const [croppedAreaPixels, setCroppedAreaPixels] = useState<ICroppedArea | null>(null)
// //   const [croppedImage, setCroppedImage] = useState<string | null>(null)

// //   const onCropComplete = (croppedArea: ICroppedArea, croppedAreaPixels: ICroppedArea) => {
// //     setCroppedAreaPixels(croppedAreaPixels)
// //   }

// //   const showCroppedImage = async () => {
// //     try {
// //       const croppedImage = await getCroppedImg(
// //         // dogImg,
// //         profilePicWhileEditing,
// //         croppedAreaPixels!,
// //         rotation
// //       )
// //       console.log('donee', { croppedImage })
// //       if (croppedImage) {
// //         setCroppedImage(croppedImage)
// //         const blob = await fetch(croppedImage).then(r => r.blob());
// //         const croppedFile = new File([blob], 'profile_picture.jpg', { type: 'image/jpeg' });
// //         setProfilePictureFile(croppedFile);


// //         const reader = new FileReader();
// //         reader.onload = (event) => {
// //           setProfilePictureUrl(event.target?.result as string);
// //         };
// //         reader.readAsDataURL(blob);
        
// //         }
// //     } catch (e: any) {
// //       console.error(e)
// //     }
// //   }

// //   const onClose = () => {
// //     setCroppedImage(null)
// //   }

//   return (
//     <div>
//       <CropContainer>
//         <Cropper
//         //   image={dogImg}
//           image={profilePicWhileEditing}
//           crop={crop}
//           rotation={rotation}
//           zoom={zoom}
//           aspect={4 / 3}
//           onCropChange={setCrop}
//           onRotationChange={setRotation}
//           onCropComplete={onCropComplete}
//           onZoomChange={setZoom}
//         />
//       </CropContainer>
//       <Controls>
//         <SliderContainer>
//           <SliderLabel variant="overline">
//             Zoom
//           </SliderLabel>
//           <StyledSlider
//             value={zoom}
//             min={1}
//             max={3}
//             step={0.1}
//             aria-labelledby="Zoom"
//             onChange={(_, newValue) => setZoom(newValue as number)}
//           />
//         </SliderContainer>
//         <SliderContainer>
//           <SliderLabel variant="overline">
//             Rotation
//           </SliderLabel>
//           <StyledSlider
//             value={rotation}
//             min={0}
//             max={360}
//             step={1}
//             aria-labelledby="Rotation"
//             onChange={(_, newValue) => setRotation(newValue as number)}
//           />
//         </SliderContainer>
//         <CropButton onClick={showCroppedImage} variant="contained" color="primary">
//           Show Result
//         </CropButton>
//       </Controls>
//       <ImgDialog img={croppedImage || undefined} onClose={onClose} />
//     </div>
//   )
// }

// export default Demo;
