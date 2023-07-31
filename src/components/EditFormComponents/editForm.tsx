// import React, { useState } from 'react';
// import { ItineraryItem } from 'path/to/itinerary/types';

// type EditFormProps = {
//   item: ItineraryItem;
//   onSave: (updatedItem: ItineraryItem) => void;
//   onCancel: () => void;
// };

// const EditForm: React.FC<EditFormProps> = ({ item, onSave, onCancel }) => {
//   const [editedItem, setEditedItem] = useState<ItineraryItem>(item);

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setEditedItem((prevItem) => ({
//       ...prevItem,
//       [name]: value,
//     }));
//   };

//   const handleSave = () => {
//     onSave(editedItem);
//   };

//   const handleCancel = () => {
//     onCancel();
//   };

//   return (
//     <div>
//       <label>
//         Site Name:
//         <input
//           type="text"
//           name="siteName"
//           value={editedItem.siteName || ''}
//           onChange={handleInputChange}
//         />
//       </label>

//       <label>
//         Start Time:
//         <input
//           type="text"
//           name="startTime"
//           value={editedItem.startTime?.time?.toString() || ''}
//           onChange={handleInputChange}
//         />
//       </label>

//       <label>
//         End Time:
//         <input
//           type="text"
//           name="endTime"
//           value={editedItem.endTime?.time?.toString() || ''}
//           onChange={handleInputChange}
//         />
//       </label>

//       {/* Add other fields here based on the ItineraryItem shape */}
      
//       <button onClick={handleSave}>Save</button>
//       <button onClick={handleCancel}>Cancel</button>
//     </div>
//   );
// };

// export default EditForm;
