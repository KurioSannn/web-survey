import { supabase } from "../lib/supabaseClient";

export async function getSurveyStatus() {

  const { data } = await supabase
    .from("settings")
    .select("*")
    .single();

  if (!data.survey_open) return "closed";

  const today = new Date();
  const closeDate = new Date(data.close_date);

  if (today > closeDate) return "closed";

  const { count } = await supabase
    .from("responses")
    .select("*", { count: "exact", head: true });

  if (count && count >= data.target) return "closed";

  return "open";
}