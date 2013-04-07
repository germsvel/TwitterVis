class Home < ActiveRecord::Base
 

  def self.search_hashtag(hashtag)
    dates = []
    
    # max_id = Twitter.search("#{hashtag} -rt", :count => 1).results.last.id

    # for page in 1..20 do
      results = Twitter.search("#{hashtag} -rt", :count => 100).results
      results.each do |result|
        dates << result.created_at
      end

      # max_id = results.last.id
    # end

    return dates
  end

end
