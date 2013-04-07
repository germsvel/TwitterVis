class Home < ActiveRecord::Base
 

  def self.search_hashtag(hashtag)
    dates = []
    
    Twitter.search("#{hashtag} -rt", :count => 100).results.each do |result|
      dates << result.created_at
    end
    
    return dates
  end

end
