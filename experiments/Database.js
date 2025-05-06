const { createClient } = supabase;

setTimeout(async () => {

    const supabase = createClient('https://dbwxeoshrqssbrvtggbf.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRid3hlb3NocnFzc2JydnRnZ2JmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg2NzI2NTYsImV4cCI6MjA1NDI0ODY1Nn0.nf7q3-2sJI9uwQ2w-GxJ4iKUTZlYAjuYdy_pOMfiJBg')

    const { data, error } = await supabase
        .from('user')
        .select()

    if (error) {
    console.log('supabase error:', error)
    } else {
    console.log('data:', data)
    console.log('no error', error)
    }

}, 1);
