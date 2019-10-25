# frozen_string_literal: true

require "lib/block_resolver"

activate :autoprefixer do |prefix|
  prefix.browsers = "last 2 versions"
end

activate :dato, live_reload: true
activate :directory_indexes

# dato.tap do |dato|
#  dato.cases.each do |case_study|
#    proxy "/cases/#{case_study.slug}", "/templates/case.html", layout: "layout", locals: { case_study: case_study }
#  end
# end

# Layouts
# https://middlemanapp.com/basics/layouts/

# Per-page layout changes
page "/*.xml", layout: false
page "/*.json", layout: false
page "/*.txt", layout: false

@app.define_setting :block_resolver, BlockResolver.new

helpers do
  def render_block(block, *args)
    key = block.item_type.api_key
    resolved_path = @app.config.block_resolver.resolve(current_page.source_file, key)
    partial resolved_path, locals: Hash[key, block].merge(args.inject(:merge))
  end

  def markdown(text, additional_text="")
    renderer = Redcarpet::Render::HTML.new
    Redcarpet::Markdown.new(renderer).render(text + additional_text)
  end

  def internal_link(slug)
    sitemap.resources.detect do |resource|
      resource.path.split("/").last.split(".")[0] == slug
    end
  end
end
