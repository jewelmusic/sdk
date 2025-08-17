# frozen_string_literal: true

require_relative 'lib/jewelmusic/version'

Gem::Specification.new do |spec|
  spec.name = 'jewelmusic'
  spec.version = JewelMusic::VERSION
  spec.authors = ['JewelMusic Team']
  spec.email = ['developers@jewelmusic.art']

  spec.summary = 'Official Ruby SDK for JewelMusic AI-powered music distribution platform'
  spec.description = <<~DESC
    The official Ruby SDK for JewelMusic's AI-powered music distribution platform.
    Provides comprehensive access to music analysis, distribution, transcription,
    analytics, and user management features.
  DESC
  
  spec.homepage = 'https://jewelmusic.art'
  spec.license = 'MIT'
  spec.required_ruby_version = '>= 3.0.0'

  spec.metadata['homepage_uri'] = spec.homepage
  spec.metadata['source_code_uri'] = 'https://github.com/jewelmusic/sdk/tree/main/ruby'
  spec.metadata['changelog_uri'] = 'https://github.com/jewelmusic/sdk/blob/main/ruby/CHANGELOG.md'
  spec.metadata['documentation_uri'] = 'https://docs.jewelmusic.art/sdk/ruby'
  spec.metadata['bug_tracker_uri'] = 'https://github.com/jewelmusic/sdk/issues'

  # Specify which files should be added to the gem when it is released.
  spec.files = Dir.chdir(__dir__) do
    `git ls-files -z`.split("\x0").reject do |f|
      (f == __FILE__) || f.match(%r{\A(?:(?:bin|test|spec|features)/|\.(?:git|travis|circleci)|appveyor)})
    end
  end
  
  spec.bindir = 'exe'
  spec.executables = spec.files.grep(%r{\Aexe/}) { |f| File.basename(f) }
  spec.require_paths = ['lib']

  # Runtime dependencies
  spec.add_dependency 'faraday', '~> 2.0'
  spec.add_dependency 'faraday-multipart', '~> 1.0'
  spec.add_dependency 'faraday-retry', '~> 2.0'
  spec.add_dependency 'mime-types', '~> 3.0'
  spec.add_dependency 'json', '~> 2.0'

  # Development dependencies
  spec.add_development_dependency 'bundler', '~> 2.0'
  spec.add_development_dependency 'rake', '~> 13.0'
  spec.add_development_dependency 'rspec', '~> 3.0'
  spec.add_development_dependency 'webmock', '~> 3.0'
  spec.add_development_dependency 'vcr', '~> 6.0'
  spec.add_development_dependency 'rubocop', '~> 1.0'
  spec.add_development_dependency 'rubocop-rspec', '~> 2.0'
  spec.add_development_dependency 'yard', '~> 0.9'
  spec.add_development_dependency 'simplecov', '~> 0.21'

  # For more information and examples about making a new gem, check out our
  # guide at: https://bundler.io/guides/creating_gem.html
end