# frozen_string_literal: true

class BlockResolver
  def initialize
    @cache = {}
  end

  def resolve_path(src, key)
    # puts "cache miss, #{src}-#{key}"
    base_path = "#{::Middleman::Util.current_directory}/source/blocks"
    parent = File.basename(src).split(".")[0]
    return "blocks/#{parent}/#{key}" if File.exist?("#{base_path}/#{parent}/_#{key}.html.erb")
    return "blocks/#{key}" if File.exist?("#{base_path}/_#{key}.html.erb")

    raise "Block not found! Looked in #{base_path}/#{parent}/_#{key}.html.erb and #{base_path}/_#{key}.html.erb"
  end

  def resolve(src, key)
    resolve_path(src, key)

    # If we want to enable cache later on, we can do it thusly:
    # cache_key = "#{key}-#{src}"
    # @cache[cache_key] = resolve_path(src, key) if @cache[cache_key].nil?
    # @cache[cache_key]
  end
end
