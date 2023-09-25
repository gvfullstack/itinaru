import React, { useState, useEffect, useRef } from 'react';
import 'firebase/firestore';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import styles from './UserProfile.module.css';
import { firebaseStorage  } from '../FirebaseAuthComponents/config/firebase.storage';
import { db  } from '../FirebaseAuthComponents/config/firebase.database';
import { collection, doc, updateDoc } from 'firebase/firestore';
import { authUserState, privacySettingsState } from '../../atoms/atoms'
import { useRecoilState } from 'recoil';
import { useRouter } from 'next/router';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject  } from 'firebase/storage';
import pica from 'pica';
import { PrivacySettings } from '@/components/typeDefs';
import 'react-quill/dist/quill.snow.css';
import BioComponent from './BioComponent';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTrashCan, faPaperclip, faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import Cropper from 'react-easy-crop'
import Slider from '@mui/material/Slider'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/system'
import ImgDialog from './UserProfileEditUtilityFunctions/ImgDialog'
import getCroppedImg from './UserProfileEditUtilityFunctions/cropImage'
import { styleSettings } from './UserProfileEditUtilityFunctions/styleSettings'

const ReactQuill = dynamic(import('react-quill'), {
  ssr: false, // This will make the component render only on the client-side
  loading: () => <p>Loading...</p>, // You can provide a loading component or text here
});

interface ICroppedArea {
  x: number
  y: number
  width: number
  height: number
}

const CropContainer = styled('div')(styleSettings.cropContainer)
const Controls = styled('div')(styleSettings.controls)
const SliderContainer = styled('div')(styleSettings.sliderContainer)
const SliderLabel = styled(Typography)(styleSettings.sliderLabel)
const StyledSlider = styled(Slider)(styleSettings.slider)
const CropButton = styled(Button)(styleSettings.cropButton)

const UserProfile: React.FC = () => {
  const router = useRouter();
  const [authUser, setAuthUser] = useRecoilState(authUserState);
  const [recoilPrivacySettings, setRecoilPrivacySettings] = useRecoilState(privacySettingsState);
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [profilePicWhileEditing, setProfilePicWhileEditing] = useState("");
  const [privacyIsEditing, setPrivacyIsEditing] = useState(false);
  const [localPrivacySettings, setLocalPrivacySettings] = useState<PrivacySettings>({
    username: false,
    firstName: false,
    lastName: false,
    phoneNumber: false,
    email: false,
    bio: false,
    profilePictureUrl: false
  });
  type PrivacyFields = 'username' | 'firstName' | 'lastName' | 'phoneNumber' | 'email' | 'bio' | 'profilePictureUrl';
 
 /////////////cropper stuff//////////////////////////////
 
  const [crop, setCrop] = useState<{ x: number, y: number }>({ x: 0, y: 0 })
  const [rotation, setRotation] = useState<number>(0)
  const [zoom, setZoom] = useState<number>(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<ICroppedArea | null>(null)
  const [croppedImage, setCroppedImage] = useState<string | null>(null)
  
  const onCropComplete = (croppedArea: ICroppedArea, croppedAreaPixels: ICroppedArea) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }

  const showCroppedImage = async () => {
    try {
      const croppedImage = await getCroppedImg(
        // dogImg,
        profilePicWhileEditing,
        croppedAreaPixels!,
        rotation
      )
      console.log('donee', { croppedImage })
      if (croppedImage) {
        setCroppedImage(croppedImage)
        const blob = await fetch(croppedImage).then(r => r.blob());
        const croppedFile = new File([blob], 'profile_picture.jpg', { type: 'image/jpeg' });
        setProfilePictureFile(croppedFile);


        const reader = new FileReader();
        reader.onload = (event) => {
          setProfilePictureUrl(event.target?.result as string);
        };
        reader.readAsDataURL(blob);
        
        }
    } catch (e: any) {
      console.error(e)
    }
  }

  const onClose = () => {
    setCroppedImage(null)
  }
  /////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////


  useEffect(() => {

    if (authUser) {
      setFirstName(authUser.firstName || '');
      setLastName(authUser.lastName || '');
      setPhoneNumber(authUser.phoneNumber || '');
      setBio(authUser.bio || '');
      setEmail(authUser.email || '');
      setUsername(authUser.username || '');
      setProfilePictureUrl(authUser.profilePictureUrl || '');
      if (recoilPrivacySettings !== null) {
        setLocalPrivacySettings(recoilPrivacySettings);
      }

    }
    else{
      sessionStorage.setItem('preLoginRoute', router.asPath);
      router.push('/loginPage');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    setProfilePictureUrl(prevProfilePictureUrl => profilePicWhileEditing);
    const storage = firebaseStorage;
    const userId = authUser?.uid;
    const fileName = 'profilePicture';
    const storageRef = ref(storage, `profilePictures/${userId}/${fileName}`);
    const uploadTask = profilePicWhileEditing !== "" ? uploadBytesResumable(storageRef, profilePictureFile!) : null;
  
    if (authUser && authUser.uid) {
      const userRef = doc(db, 'users', authUser.uid);
  
      if (uploadTask) {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Progress tracking if needed
          },
          (error) => {
            console.error('Upload failed:', error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
              try {
                await updateDoc(userRef, {
                  firstName,
                  lastName,
                  phoneNumber,
                  bio,
                  email,
                  username,
                  profilePictureUrl: downloadURL,
                });
  
                setAuthUser({
                  ...authUser,
                  firstName,
                  lastName,
                  phoneNumber,
                  bio,
                  email,
                  username,
                  profilePictureUrl: downloadURL,
                });
  
                // Delete image from storage if profilePicWhileEditing is empty
                if (profilePicWhileEditing === "") {
                  deleteObject(storageRef);
                }
  
                setEditing(false);
                // Redirect or handle the successful update
              } catch (error) {
                console.error('Error updating profile information:', error);
              }
            });
          }
        );
      } else {
        // No upload task, only update the user's profile
        await updateDoc(userRef, {
          firstName,
          lastName,
          phoneNumber,
          bio,
          email,
          username,
          profilePictureUrl: ''
        });
  
        setAuthUser({
          ...authUser,
          firstName,
          lastName,
          phoneNumber,
          bio,
          email,
          username,
          profilePictureUrl: ''
        });
  
        setEditing(false);
        // Redirect or handle the successful update
      }
    } else {
      router.push('/login');
    }
  };
  
  
  const resetProfileForm = () => {
    setFirstName(authUser?.firstName || '');
    setLastName(authUser?.lastName || '');
    setPhoneNumber(authUser?.phoneNumber || '');
    setBio(authUser?.bio || '');
    setEmail(authUser?.email || '');
    setUsername(authUser?.username || '');
    setProfilePicWhileEditing(authUser?.profilePictureUrl || '');
  };
////////////////////////////////////////////////////////////////
const imageProcessing = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file && /^image\/(jpeg|png|gif)$/.test(file.type)) {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      // This will set the selected image as the preview
      setProfilePicWhileEditing(event.target?.result as string);
    };

    reader.readAsDataURL(file); // Read the file as Data URL

    resizeImage(file, (resizedFile) => {
      if (resizedFile) {
        setProfilePictureFile(resizedFile);
      } else {
        alert('An error occurred while processing the image.');
      }
    });
    
  } else {
    alert('Please select a valid image file (JPEG, PNG, or GIF).');
    setProfilePicWhileEditing(""); // Reset the URL if an invalid file type is selected
    e.target.value = '';
  }
};

///////////////////////////////////////////////////////////////
const resizeImage = (file: File, callback: (result: File | null) => void) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = (event) => {
    const img = new window.Image();///used window because Image(); conflicts with next/image
    img.src = event.target?.result as string;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const picaInstance = pica();

      // Set the max desired size
      const maxWidth = 512; // Max width for the image
      const maxHeight = 512; // Max height for the image

      let { width, height } = img;

      // Maintain aspect ratio
      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      picaInstance.resize(img, canvas, {
        unsharpAmount: 40,
        unsharpRadius: 0.6,
        unsharpThreshold: 1,
      }).then(() => {
        canvas.toBlob((blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, { type: 'image/jpeg' });
            callback(resizedFile);
          } else {
            callback(null);
          }
        }, 'image/jpeg', 0.9); // You can adjust the compression quality here, e.g. 0.9 for higher quality
      });
    };
  };
};

////////////////////////////////////////////////////////////////////

const inputFileRef = useRef<HTMLInputElement>(null);

const removeImage = (e: React.MouseEvent<HTMLElement| SVGSVGElement>) => {
  e.preventDefault();
  setProfilePicWhileEditing("");
  setProfilePictureFile(null);
  if (inputFileRef.current) {
    inputFileRef.current.value = "";
  }
};

////////////////////Security////////////////////////////
const handleCheckboxChange = (field: PrivacyFields) => {
  setLocalPrivacySettings({
    ...localPrivacySettings,
    [field]: !localPrivacySettings[field],
  });
};

const saveRecoilPrivacySettings = ()=>{
  setRecoilPrivacySettings({
    username: localPrivacySettings?.username || false,
    firstName: localPrivacySettings?.firstName || false,
    lastName: localPrivacySettings?.lastName || false,
    phoneNumber: localPrivacySettings?.phoneNumber || false,
    email: localPrivacySettings?.email || false,
    bio: localPrivacySettings?.bio || false,
    profilePictureUrl: localPrivacySettings?.profilePictureUrl || false
  })
}

////////////////////////////////////////////////

const resetLocalSecurityForm = () => {
    setLocalPrivacySettings({
      username: recoilPrivacySettings?.username || false,
      firstName: recoilPrivacySettings?.firstName || false,
      lastName: recoilPrivacySettings?.lastName || false,
      phoneNumber: recoilPrivacySettings?.phoneNumber || false,
      email: recoilPrivacySettings?.email || false,
      bio: recoilPrivacySettings?.bio || false,
      profilePictureUrl: recoilPrivacySettings?.profilePictureUrl || false
    })
};
////////////////////////////
const updatePrivacySettings = async () => {
  if (!authUser || !authUser.uid) {
    // Redirect to the login page or handle this case as needed
    router.push('/profileSettings');
    return;
  }

  try {
    // Get a reference to the user's document
    const userRef = doc(db, 'users', authUser.uid);
    // Update the privacySettings field with the values from your state
    await updateDoc(userRef, {
      privacySettings: localPrivacySettings
    });

    saveRecoilPrivacySettings()
    // If needed, you can update the authUser object here
    // ...
    // Handle successful update (e.g., redirect, show a success message, etc.)
    // ...

  } catch (error) {
    // Handle the error as appropriate for your application
    console.error('Error updating privacy settings:', error);
  }
};

const trashDelete = (
        <FontAwesomeIcon 
            icon={faTrashCan} 
            className={styles.trashIcon} 
            type="button" 
            onClick={(e) => {
                e.preventDefault();
                removeImage(e);
              }
            }
        />
);

const resetPhotoIcon = (
        <FontAwesomeIcon
            icon={faRotateLeft}
            className={styles.resetPhotoIcon}
            type="button"
            onClick={(e) =>  {e.preventDefault();
              setProfilePicWhileEditing(prev=>profilePictureUrl)}}
        />
      );
const attachIcon = (
      <FontAwesomeIcon 
          icon={faPaperclip} 
          className={styles.attachIcon} 
          type="button" 
          onClick={(e) =>  {e.preventDefault();
            inputFileRef.current?.click()}}
      />
    );     
  return (
    <>
    <div className={styles.tabsContainer}>
      <Tabs>
        <TabList>
          <Tab>Personal Information</Tab>
          <Tab>Security Settings</Tab>
        </TabList>

        <TabPanel>
        {editing ? (
          <div className={styles.formContainer}>
            <h3>Personal Information</h3>
            <form onSubmit={handleSubmit}>
             <label className={styles.profileLabel}>
                User Name:
                <input className={styles.profileInput} type="text" value={username} onChange={(e) => setUsername(e.target.value)}  />
              </label>
              <label className={styles.profileLabel}>
                First Name:
                <input className={styles.profileInput} type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}  />
              </label>
              <label className={styles.profileLabel}>
                Last Name:
                <input className={styles.profileInput} type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}  />
              </label>
              <label className={styles.profileLabel}>
                Phone Number:
                <input className={styles.profileInput} type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}  />
              </label>
              <label className={styles.profileLabel}>
                Email:
                <input className={styles.profileInput} type="email" value={email} onChange={(e) => setEmail(e.target.value)}  />
              </label> 
              <label className={styles.profileLabel}>Bio:</label>
                <ReactQuill
                  value={bio}
                  onChange={setBio}
                />
             <div>
            <CropContainer>
              <Cropper
                image={profilePicWhileEditing}
                crop={crop}
                rotation={rotation}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onRotationChange={setRotation}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                cropShape="round"
              />
            </CropContainer>
            <Controls>
              <SliderContainer>
                <SliderLabel variant="overline">
                  Zoom
                </SliderLabel>
                <StyledSlider
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(_, newValue) => setZoom(newValue as number)}
                />
              </SliderContainer>
              <SliderContainer>
                <SliderLabel variant="overline">
                  Rotation
                </SliderLabel>
                <StyledSlider
                  value={rotation}
                  min={0}
                  max={360}
                  step={1}
                  aria-labelledby="Rotation"
                  onChange={(_, newValue) => setRotation(newValue as number)}
                />
              </SliderContainer>
              <CropButton onClick={showCroppedImage} variant="contained" color="primary">
                Show Result
              </CropButton>
            </Controls>
            <ImgDialog img={croppedImage || undefined} onClose={onClose} />
          </div>
             
              <label className={styles.profileLabel} >
                <p>Profile Picture:</p>
                <input 
                  id="profilePictureUploaded"
                  ref={inputFileRef}
                  className={styles.profileInput} 
                  type="file" 
                  accept="image/jpeg, image/png, image/gif" 
                  onChange={imageProcessing} 
                  style={{ display: "none" }} // Hide the input
                />
              </label>

                <div className= {styles.UPPhotoAttachIconButtons}>                
                  {attachIcon}
                  {resetPhotoIcon}
                  {profilePicWhileEditing != "" && 
                    <div>
                      {trashDelete}                  
                    </div>}
                </div>
              <p className={styles.profilePictureMessage}>*Image uploads must be in JPEG, PNG, or GIF format.</p>
              <button className={styles.profileSaveButton} type="submit">Save</button>
              <button className={styles.profileCancelButton} type="button" 
              onClick={() => { resetProfileForm(); setEditing(false); }}>Cancel</button>

          </form>
          </div>
        ) : (
        <div className={styles.profileStaticContainer}>
          {profilePictureUrl != "" &&
          <div className={styles.profilePicImageContainer}>
              <Image 
                    src={authUser?.profilePictureUrl || ''} 
                    alt="user profile picture" 
                    width={512} // replace with actual image width
                    height={512} // replace with actual image height
                    loading='lazy'
                    style={{ width: '100%', height: 'auto', objectFit: 'cover' }}            
                />
          </div>}
          <p className={styles.profileStaticFields}>Username: {authUser?.username}</p>
          <p className={styles.profileStaticFields}>First Name: {authUser?.firstName}</p>
          <p className={styles.profileStaticFields}>Last Name: {authUser?.lastName}</p>
          <p className={styles.profileStaticFields}>Phone Number: {authUser?.phoneNumber}</p>
          <p className={styles.profileStaticFields}>Email: {authUser?.email}</p>
          {/* <p className={`${styles.profileStaticFields} ${styles.profileStaticFieldsBio}`}>Bio: {authUser?.bio}</p> */}
          <div className={styles.profileStaticFieldsBio}>
             <BioComponent bio={authUser?.bio ?? ''} />
          </div>

          <button className={styles.profileEditButton}
          onClick={() =>{setEditing(true); setProfilePicWhileEditing(prev=>profilePictureUrl)}}>Edit</button> 
        </div>
      )}
        </TabPanel>

        <TabPanel>
          <div>
            {privacyIsEditing ? (
              <>
            <form className={styles.checkBoxContainer}>
              <h3>Privacy Settings</h3>
              <p>Please check fields you would like to share publicly.</p>
              <label className={styles.checkBoxItems}>
                <input
                  type="checkbox"
                  checked={localPrivacySettings.username}
                  onChange={() => handleCheckboxChange('username')}
                />
                Username
              </label>
              <label className={styles.checkBoxItems}>
                <input
                  type="checkbox"
                  checked={localPrivacySettings.firstName}
                  onChange={() => handleCheckboxChange('firstName')}
                />
                First Name
              </label>
              <label className={styles.checkBoxItems}>
                <input
                  type="checkbox"
                  checked={localPrivacySettings.lastName}
                  onChange={() => handleCheckboxChange('lastName')}
                />
                Last Name
              </label>
              <label className={styles.checkBoxItems}>
                <input
                  type="checkbox"
                  checked={localPrivacySettings.phoneNumber}
                  onChange={() => handleCheckboxChange('phoneNumber')}
                />
                Phone Number
              </label>
              <label className={styles.checkBoxItems}>
                <input
                  type="checkbox"
                  checked={localPrivacySettings.email}
                  onChange={() => handleCheckboxChange('email')}
                />
                E-mail
              </label>
              <label className={styles.checkBoxItems}>
                <input
                  type="checkbox"
                  checked={localPrivacySettings.profilePictureUrl}
                  onChange={() => handleCheckboxChange('profilePictureUrl')}
                />
                Profile Picture
              </label>
              <label className={styles.checkBoxItems}>
                <input
                  type="checkbox"
                  checked={localPrivacySettings.bio}
                  onChange={() => handleCheckboxChange('bio')}
                />
                Bio
              </label>
              <div className={styles.securityButtonContainer}>
               
                <button type="button" onClick={()=>{
                    setPrivacyIsEditing(false);
                    updatePrivacySettings()}
                  } 
                    className={styles.profileSaveButton}>
                      Save Changes
                </button>

                <button 
                  className={styles.profileCancelButton} type="button" 
                  onClick={() => { 
                    resetLocalSecurityForm(); 
                  setPrivacyIsEditing(false); }}>
                    Cancel
                </button>
              </div>

          </form>
          </>
          ) : (
            // Static view.
            <>
          <div className={styles.profileStaticContainer}>
            <h3 className={styles.privacyH3Static}>Privacy Settings</h3>
            <h5></h5>
              <p className={styles.profileStaticFields}>Username: {localPrivacySettings.username ? "Public" : "Private"}</p>
              <p className={styles.profileStaticFields}>First Name: {localPrivacySettings.firstName ? "Public" : "Private"}</p>
              <p className={styles.profileStaticFields}>Last Name: {localPrivacySettings.lastName ? "Public" : "Private"}</p>
              <p className={styles.profileStaticFields}>Phone Number: {localPrivacySettings.phoneNumber ? "Public" : "Private"}</p>
              <p className={styles.profileStaticFields}>E-mail: {localPrivacySettings.email ? "Public" : "Private"}</p>
              <p className={styles.profileStaticFields}>Profile Picture: {localPrivacySettings.profilePictureUrl ? "Public" : "Private"}</p>
              <p className={styles.profileStaticFields}>Bio: {localPrivacySettings.bio ? "Public" : "Private"}</p>
            <button 
            className={styles.profileEditButton} 
            onClick={()=>setPrivacyIsEditing(true)}>Edit</button>
          </div>
          </>
          )}
        
          </div>
        </TabPanel>
      </Tabs>
    </div>
    </>
  );
};

export default UserProfile;
