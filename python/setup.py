"""
Setup configuration for JewelMusic Python SDK
"""

from setuptools import setup, find_packages
import os

# Read the README file
def read_readme():
    readme_path = os.path.join(os.path.dirname(__file__), 'README.md')
    try:
        with open(readme_path, 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        return "JewelMusic Python SDK - AI-powered music distribution platform"

# Read version from __init__.py
def get_version():
    version_file = os.path.join(os.path.dirname(__file__), 'jewelmusic_sdk', '__init__.py')
    try:
        with open(version_file, 'r', encoding='utf-8') as f:
            for line in f:
                if line.startswith('__version__'):
                    return line.split('=')[1].strip().strip('"\'')
    except FileNotFoundError:
        pass
    return '1.0.0'

setup(
    name='jewelmusic-sdk',
    version=get_version(),
    description='Official Python SDK for the JewelMusic AI-powered music distribution platform',
    long_description=read_readme(),
    long_description_content_type='text/markdown',
    author='JewelMusic Team',
    author_email='developers@jewelmusic.art',
    url='https://github.com/jewelmusic/sdk',
    project_urls={
        'Homepage': 'https://jewelmusic.art',
        'Documentation': 'https://docs.jewelmusic.art/sdk/python',
        'Source': 'https://github.com/jewelmusic/sdk/tree/main/python',
        'Tracker': 'https://github.com/jewelmusic/sdk/issues',
    },
    packages=find_packages(),
    classifiers=[
        'Development Status :: 4 - Beta',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: MIT License',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.8',
        'Programming Language :: Python :: 3.9',
        'Programming Language :: Python :: 3.10',
        'Programming Language :: Python :: 3.11',
        'Programming Language :: Python :: 3.12',
        'Topic :: Software Development :: Libraries :: Python Modules',
        'Topic :: Multimedia :: Sound/Audio',
        'Topic :: Multimedia :: Sound/Audio :: Analysis',
        'Topic :: Internet :: WWW/HTTP :: Dynamic Content',
        'Topic :: Scientific/Engineering :: Artificial Intelligence',
    ],
    keywords=[
        'jewelmusic',
        'music',
        'ai',
        'distribution',
        'transcription',
        'analytics',
        'audio',
        'streaming',
        'api',
        'sdk',
        'async',
        'machine-learning'
    ],
    python_requires='>=3.8',
    install_requires=[
        'aiohttp>=3.8.0,<4.0.0',
        'aiofiles>=0.8.0,<1.0.0',
    ],
    extras_require={
        'dev': [
            'pytest>=7.0.0',
            'pytest-asyncio>=0.21.0',
            'pytest-cov>=4.0.0',
            'black>=23.0.0',
            'isort>=5.12.0',
            'mypy>=1.0.0',
            'flake8>=6.0.0',
            'pre-commit>=3.0.0',
            'twine>=4.0.0',
            'wheel>=0.40.0',
        ],
        'examples': [
            'fastapi>=0.100.0',
            'uvicorn>=0.22.0',
            'python-multipart>=0.0.6',
            'flask>=2.3.0',
        ],
        'docs': [
            'sphinx>=6.0.0',
            'sphinx-rtd-theme>=1.2.0',
            'sphinx-autodoc-typehints>=1.22.0',
        ],
        'test': [
            'pytest>=7.0.0',
            'pytest-asyncio>=0.21.0',
            'pytest-cov>=4.0.0',
            'responses>=0.23.0',
            'httpx>=0.24.0',
        ],
    },
    entry_points={
        'console_scripts': [
            'jewelmusic=jewelmusic_sdk.cli:main',
        ],
    },
    include_package_data=True,
    package_data={
        'jewelmusic_sdk': ['py.typed'],
    },
    zip_safe=False,
    license='MIT',
    platforms=['any'],
)