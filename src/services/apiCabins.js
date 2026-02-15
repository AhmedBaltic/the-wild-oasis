import supabase, { supabaseUrl } from "./supabase.js";

export async function getCabins() {
  const { data, error } = await supabase
    .from("cabins")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.log(error);
    throw new Error("Cabins couldn't be loaded");
  }

  return data;
}
// _____________________________________________________________
export async function createEditCabin(newCabin, id) {
  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);
  const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll("/", "",);
  const imagePath = hasImagePath ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  // 1. create/edit cabin
  let query = supabase.from("cabins");

  // a. create cabin
  if (!id) query = query.insert([{ ...newCabin, image: imagePath }]);

  // b. edit cabin
  if (id) query = query.update({ ...newCabin, image: imagePath }).eq("id", id)
    .select();

  const { data, error } = await query.select().single();

  if (error) {
    console.error(error);
    throw new Error("Cabin couldn't be created");
  }

  // 2. upload image
  if (hasImagePath) return data;

  // next one line (only if statment) from comments:
  if (!hasImagePath) {       //from com.
    const { error: storageError } = await supabase.storage
      .from("cabin-images")
      .upload(imageName, newCabin.image);

    // 3. delete the cabin if there was an error uploading the image
    if (storageError) {
      await supabase.from("cabins").delete().eq("id", data.id);
      console.error(storageError);
      throw new Error(
        "Cabin image could not be uploaded and the cabin was not created.",
      );
    }
  }                          //from com.

  return data;
}

// _____________________________________________________________
export async function deleteCabin(id) {
  const { data, error } = await supabase.from("cabins").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Cabin couldn't be deleted");
  }

  return data;
}

// Updated version of DELETE  CABIN feature with DELETE bucket image handling:

// export async function deleteCabin(id) {
//   // #1. Read the cabin data pertinent to this id - to be used reverting the
//   data if failed deleting the image
//   const { data: cabin, error: cabinReadError } = await supabase
//     .from("cabins")
//     .select("*")
//     .eq("id", id);
//   if (cabinReadError) {
//     console.error(cabinReadError);
//     throw new Error("Can't retrieve cabin information from DB");
//   }
//   const imgFileName = cabin[0].image.split("/").at(-1);
//   const backupCabinData = cabin[0];

//   // #2. Delete the cabin item from DB cabins table
//   const { error: cabinDeleteError } = await supabase
//     .from("cabins")
//     .delete()
//     .eq("id", id);
//   if (cabinDeleteError) {
//     console.error(cabinDeleteError);
//     throw new Error("Cabin could not be deleted");
//   }

//   // #3. Delete Image from DB bucket
//   const { error: fileRemoveError } = await supabase.storage
//     .from("cabin-images")
//     .remove([imgFileName]);
//   if (fileRemoveError) {
//     //Revert deletion
//     createCabin(backupCabinData);
//     //Error handling
//     console.error(fileRemoveError);
//     throw new Error(
//       "Encountered a problem removing the cabin image. Cabin did not get deleted."
//     );
//   }
// }
