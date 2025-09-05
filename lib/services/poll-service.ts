import { supabase } from "@/lib/supabase";
import { Database } from "@/lib/database.types";

export type Poll = Database["public"]["Tables"]["polls"]["Row"];
export type PollOption = Database["public"]["Tables"]["poll_options"]["Row"];
export type Vote = Database["public"]["Tables"]["votes"]["Row"];

export type PollWithOptions = Poll & {
  options: PollOption[];
  votes_count: number;
};

export type PollWithOptionsAndVotes = PollWithOptions & {
  votes: Vote[];
  registered_votes_count: number;
  anonymous_votes_count: number;
};

export const pollService = {
  async createPoll(
    poll: Database["public"]["Tables"]["polls"]["Insert"],
    options: string[],
  ) {
    // Insert the poll
    const { data: pollData, error: pollError } = await supabase
      .from("polls")
      .insert(poll)
      .select()
      .single();

    if (pollError) throw pollError;

    // Insert the options
    const optionsToInsert = options.map((text) => ({
      poll_id: pollData.id,
      text,
    }));

    const { data: optionsData, error: optionsError } = await supabase
      .from("poll_options")
      .insert(optionsToInsert)
      .select();

    if (optionsError) throw optionsError;

    return {
      ...pollData,
      options: optionsData,
    };
  },

  async getPollById(id: string): Promise<PollWithOptionsAndVotes | null> {
    // Get the poll
    const { data: poll, error: pollError } = await supabase
      .from("polls")
      .select("*")
      .eq("id", id)
      .single();

    if (pollError) {
      if (pollError.code === "PGRST116") return null; // Record not found
      throw pollError;
    }

    // Get the options
    const { data: options, error: optionsError } = await supabase
      .from("poll_options")
      .select("*")
      .eq("poll_id", id);

    if (optionsError) throw optionsError;

    // Get the votes
    const { data: votes, error: votesError } = await supabase
      .from("votes")
      .select("*")
      .eq("poll_id", id);

    if (votesError) throw votesError;

    const registered_votes_count = votes.filter((v) => v.user_id).length;
    const anonymous_votes_count = votes.length - registered_votes_count;

    return {
      ...poll,
      options,
      votes,
      votes_count: votes.length,
      registered_votes_count,
      anonymous_votes_count,
    };
  },

  async getUserPolls(userId: string): Promise<PollWithOptions[]> {
    // Get all polls for the user
    const { data: polls, error: pollsError } = await supabase
      .from("polls")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (pollsError) throw pollsError;

    const pollIds = polls.map((poll) => poll.id);

    // Get all options for the user's polls
    const { data: options, error: optionsError } = await supabase
      .from("poll_options")
      .select("*")
      .in("poll_id", pollIds);

    if (optionsError) throw optionsError;

    // Get all votes for the user's polls
    const { data: votes, error: votesError } = await supabase
      .from("votes")
      .select("poll_id")
      .in("poll_id", pollIds);

    if (votesError) throw votesError;

    // Create a map of options by poll_id
    const optionsByPollId = new Map<string, PollOption[]>();
    for (const option of options) {
      if (!optionsByPollId.has(option.poll_id)) {
        optionsByPollId.set(option.poll_id, []);
      }
      optionsByPollId.get(option.poll_id)!.push(option);
    }

    // Create a map of vote counts by poll_id
    const votesCountByPollId = new Map<string, number>();
    for (const vote of votes) {
      votesCountByPollId.set(
        vote.poll_id,
        (votesCountByPollId.get(vote.poll_id) || 0) + 1,
      );
    }

    // Combine the data
    const pollsWithOptions = polls.map((poll) => ({
      ...poll,
      options: optionsByPollId.get(poll.id) || [],
      votes_count: votesCountByPollId.get(poll.id) || 0,
    }));

    return pollsWithOptions;
  },

  async getPublicPolls(): Promise<PollWithOptions[]> {
    // Get all public polls
    const { data: polls, error: pollsError } = await supabase
      .from("polls")
      .select("*")
      .eq("is_public", true)
      .order("created_at", { ascending: false });

    if (pollsError) throw pollsError;

    const pollIds = polls.map((poll) => poll.id);

    // Get all options for the public polls
    const { data: options, error: optionsError } = await supabase
      .from("poll_options")
      .select("*")
      .in("poll_id", pollIds);

    if (optionsError) throw optionsError;

    // Get all votes for the public polls
    const { data: votes, error: votesError } = await supabase
      .from("votes")
      .select("poll_id")
      .in("poll_id", pollIds);

    if (votesError) throw votesError;

    // Create a map of options by poll_id
    const optionsByPollId = new Map<string, PollOption[]>();
    for (const option of options) {
      if (!optionsByPollId.has(option.poll_id)) {
        optionsByPollId.set(option.poll_id, []);
      }
      optionsByPollId.get(option.poll_id)!.push(option);
    }

    // Create a map of vote counts by poll_id
    const votesCountByPollId = new Map<string, number>();
    for (const vote of votes) {
      votesCountByPollId.set(
        vote.poll_id,
        (votesCountByPollId.get(vote.poll_id) || 0) + 1,
      );
    }

    // Combine the data
    const pollsWithOptions = polls.map((poll) => ({
      ...poll,
      options: optionsByPollId.get(poll.id) || [],
      votes_count: votesCountByPollId.get(poll.id) || 0,
    }));

    return pollsWithOptions;
  },

  async vote(vote: Database["public"]["Tables"]["votes"]["Insert"]) {
    const { data, error } = await supabase
      .from("votes")
      .insert(vote)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async hasVoted(pollId: string, fingerprint: string): Promise<boolean> {
    const { count, error } = await supabase
      .from("votes")
      .select("*", { count: "exact", head: true })
      .eq("poll_id", pollId)
      .eq("voter_fingerprint", fingerprint);

    if (error) throw error;

    return (count || 0) > 0;
  },

  async deletePoll(id: string) {
    // Get the poll first to make sure it exists
    const { data: poll, error: pollError } = await supabase
      .from("polls")
      .select("*")
      .eq("id", id)
      .single();

    if (pollError) {
      if (pollError.code === "PGRST116")
        return { success: false, message: "Poll not found" };
      throw pollError;
    }

    // Delete votes first (due to foreign key constraints)
    const { error: votesError } = await supabase
      .from("votes")
      .delete()
      .eq("poll_id", id);

    if (votesError) throw votesError;

    // Delete options
    const { error: optionsError } = await supabase
      .from("poll_options")
      .delete()
      .eq("poll_id", id);

    if (optionsError) throw optionsError;

    // Delete the poll
    const { error: deleteError } = await supabase
      .from("polls")
      .delete()
      .eq("id", id);

    if (deleteError) throw deleteError;

    return { success: true };
  },

  async updatePoll(
    poll: Partial<Database["public"]["Tables"]["polls"]["Update"]> & {
      id: string;
    },
    options: Array<{ id?: string; text: string }>,
  ) {
    const { id, ...updates } = poll;

    // First verify the poll belongs to the user
    const { data: existingPoll, error: pollError } = await supabase
      .from("polls")
      .select("*")
      .eq("id", id)
      .eq("user_id", poll.user_id)
      .single();

    if (pollError) {
      if (pollError.code === "PGRST116")
        return { success: false, message: "Poll not found" };
      throw pollError;
    }

    // Start a transaction
    const { error: transactionError } = await supabase.rpc("begin_transaction");
    if (transactionError) throw transactionError;

    try {
      // Update the poll
      const { data, error } = await supabase
        .from("polls")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      // Get existing options
      const { data: existingOptions, error: optionsError } = await supabase
        .from("poll_options")
        .select("*")
        .eq("poll_id", id);

      if (optionsError) throw optionsError;

      // Create a map of existing options by ID
      const existingOptionsMap = new Map(
        existingOptions.map((opt) => [opt.id, opt]),
      );

      // Process options: update existing, add new ones
      for (const option of options) {
        if (option.id && existingOptionsMap.has(option.id)) {
          // Update existing option
          const { error: updateError } = await supabase
            .from("poll_options")
            .update({ text: option.text })
            .eq("id", option.id);

          if (updateError) throw updateError;

          // Remove from map to track which ones to delete
          existingOptionsMap.delete(option.id);
        } else {
          // Add new option
          const { error: insertError } = await supabase
            .from("poll_options")
            .insert({ poll_id: id, text: option.text });

          if (insertError) throw insertError;
        }
      }

      // Delete options that were removed
      const optionsToDelete = Array.from(existingOptionsMap.keys());
      if (optionsToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from("poll_options")
          .delete()
          .in("id", optionsToDelete);

        if (deleteError) throw deleteError;
      }

      // Commit transaction
      const { error: commitError } = await supabase.rpc("commit_transaction");
      if (commitError) throw commitError;

      return { success: true, data };
    } catch (error) {
      // Rollback transaction on error
      await supabase.rpc("rollback_transaction");
      throw error;
    }
  },
};
