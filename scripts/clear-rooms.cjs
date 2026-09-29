// eslint-disable-next-line @typescript-eslint/no-require-imports
const { createClient } = require('@supabase/supabase-js');
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function clearRooms() {
  console.log("Connecting to Supabase to clear old rooms...");
  const { error } = await supabase.from('rooms').delete().neq('room_code', '0000'); // Delete everything
  if (error) {
    console.error("Error clearing rooms:", error);
  } else {
    console.log("Successfully wiped all old rooms from the database!");
  }
}

clearRooms();
