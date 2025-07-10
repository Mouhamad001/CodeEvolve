import React, { useState, useEffect } from 'react';
import { Octokit } from 'octokit';
import { Button } from '@/components/ui/button.jsx';

const GitHubCodeImporter = ({ onCodeImported, onError }) => {
  const [githubUrl, setGithubUrl] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [importStatus, setImportStatus] = useState('');
  const [repositories, setRepositories] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState('');
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [importedCode, setImportedCode] = useState('');
  const [repoInfo, setRepoInfo] = useState(null);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('main');

  // Initialize Octokit client
  const [octokit, setOctokit] = useState(null);

  useEffect(() => {
    if (accessToken) {
      const client = new Octokit({
        auth: accessToken,
      });
      setOctokit(client);
    }
  }, [accessToken]);

  // Parse GitHub URL to extract owner and repo
  const parseGitHubUrl = (url) => {
    try {
      const regex = /github\.com\/([^\/]+)\/([^\/]+)/;
      const match = url.match(regex);
      if (match) {
        return {
          owner: match[1],
          repo: match[2].replace('.git', '')
        };
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  // Fetch user repositories
  const fetchUserRepositories = async () => {
    if (!octokit) return;

    try {
      setIsLoading(true);
      setImportStatus('Fetching repositories...');

      const { data } = await octokit.rest.repos.listForAuthenticatedUser({
        sort: 'updated',
        per_page: 50
      });

      setRepositories(data);
      setImportStatus(`Found ${data.length} repositories`);
    } catch (error) {
      console.error('Error fetching repositories:', error);
      setImportStatus('Error fetching repositories');
      if (onError) onError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch repository information
  const fetchRepositoryInfo = async (owner, repo) => {
    if (!octokit) return;

    try {
      setIsLoading(true);
      setImportStatus('Fetching repository information...');

      const { data } = await octokit.rest.repos.get({
        owner,
        repo
      });

      setRepoInfo(data);
      setImportStatus(`Repository: ${data.full_name}`);

      // Fetch branches
      const branchesResponse = await octokit.rest.repos.listBranches({
        owner,
        repo
      });
      setBranches(branchesResponse.data);
      setSelectedBranch(data.default_branch || 'main');

    } catch (error) {
      console.error('Error fetching repository info:', error);
      setImportStatus('Error fetching repository information');
      if (onError) onError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch repository contents
  const fetchRepositoryContents = async (owner, repo, path = '', branch = 'main') => {
    if (!octokit) return;

    try {
      setIsLoading(true);
      setImportStatus(`Fetching contents from ${path || 'root'}...`);

      const { data } = await octokit.rest.repos.getContent({
        owner,
        repo,
        path,
        ref: branch
      });

      const fileList = Array.isArray(data) ? data : [data];
      const codeFiles = fileList.filter(file => 
        file.type === 'file' && 
        /\.(js|jsx|ts|tsx|py|java|cpp|c|cs|php|rb|go|rs|swift|kt)$/i.test(file.name)
      );

      setFiles(codeFiles);
      setImportStatus(`Found ${codeFiles.length} code files`);

    } catch (error) {
      console.error('Error fetching repository contents:', error);
      setImportStatus('Error fetching repository contents');
      if (onError) onError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch file content
  const fetchFileContent = async (owner, repo, path, branch = 'main') => {
    if (!octokit) return;

    try {
      setImportStatus(`Fetching ${path}...`);

      const { data } = await octokit.rest.repos.getContent({
        owner,
        repo,
        path,
        ref: branch
      });

      if (data.content) {
        const content = atob(data.content);
        return {
          path,
          content,
          size: data.size,
          sha: data.sha
        };
      }
    } catch (error) {
      console.error(`Error fetching file ${path}:`, error);
      throw error;
    }
  };

  // Import code from GitHub URL
  const importFromUrl = async () => {
    const parsed = parseGitHubUrl(githubUrl);
    if (!parsed) {
      setImportStatus('Invalid GitHub URL');
      return;
    }

    if (!octokit) {
      setImportStatus('Please provide a GitHub access token');
      return;
    }

    try {
      setIsLoading(true);
      
      // Fetch repository info
      await fetchRepositoryInfo(parsed.owner, parsed.repo);
      
      // Fetch repository contents
      await fetchRepositoryContents(parsed.owner, parsed.repo, '', selectedBranch);

    } catch (error) {
      console.error('Error importing from URL:', error);
      setImportStatus('Error importing repository');
      if (onError) onError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Import selected files
  const importSelectedFiles = async () => {
    if (selectedFiles.length === 0) {
      setImportStatus('Please select files to import');
      return;
    }

    const parsed = parseGitHubUrl(githubUrl) || 
                   (selectedRepo ? { owner: selectedRepo.split('/')[0], repo: selectedRepo.split('/')[1] } : null);
    
    if (!parsed) {
      setImportStatus('No repository selected');
      return;
    }

    try {
      setIsLoading(true);
      setImportStatus('Importing selected files...');

      const fileContents = [];
      for (const filePath of selectedFiles) {
        const fileContent = await fetchFileContent(parsed.owner, parsed.repo, filePath, selectedBranch);
        fileContents.push(fileContent);
      }

      // Combine all file contents
      const combinedCode = fileContents.map(file => 
        `// File: ${file.path}\n${file.content}\n\n`
      ).join('');

      setImportedCode(combinedCode);
      setImportStatus(`Successfully imported ${fileContents.length} files`);

      if (onCodeImported) {
        onCodeImported({
          code: combinedCode,
          files: fileContents,
          repository: repoInfo,
          branch: selectedBranch
        });
      }

    } catch (error) {
      console.error('Error importing files:', error);
      setImportStatus('Error importing files');
      if (onError) onError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle repository selection
  const handleRepositorySelect = async (repoFullName) => {
    setSelectedRepo(repoFullName);
    const [owner, repo] = repoFullName.split('/');
    
    await fetchRepositoryInfo(owner, repo);
    await fetchRepositoryContents(owner, repo, '', selectedBranch);
  };

  // Handle file selection
  const handleFileToggle = (filePath) => {
    setSelectedFiles(prev => 
      prev.includes(filePath) 
        ? prev.filter(f => f !== filePath)
        : [...prev, filePath]
    );
  };

  // Select all files
  const selectAllFiles = () => {
    setSelectedFiles(files.map(f => f.path));
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedFiles([]);
  };

  return (
    <div className="space-y-6">
      {/* GitHub Access Token */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          GitHub Personal Access Token
        </label>
        <input
          type="password"
          value={accessToken}
          onChange={(e) => setAccessToken(e.target.value)}
          placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
          className="w-full p-3 bg-background border border-primary/30 rounded text-foreground"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Required for accessing private repositories and higher rate limits
        </p>
      </div>

      {/* GitHub URL Input */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          GitHub Repository URL
        </label>
        <div className="flex gap-2">
          <input
            type="url"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="https://github.com/owner/repository"
            className="flex-1 p-3 bg-background border border-primary/30 rounded text-foreground"
          />
          <Button
            onClick={importFromUrl}
            disabled={!githubUrl || !octokit || isLoading}
            className="bg-primary text-background hover:bg-primary/80"
          >
            {isLoading ? 'Loading...' : 'Fetch'}
          </Button>
        </div>
      </div>

      {/* Repository Browser */}
      {octokit && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-foreground">
              Your Repositories
            </label>
            <Button
              size="sm"
              onClick={fetchUserRepositories}
              disabled={isLoading}
              variant="outline"
              className="border-secondary text-secondary hover:bg-secondary/10"
            >
              Refresh
            </Button>
          </div>
          
          {repositories.length > 0 && (
            <select
              value={selectedRepo}
              onChange={(e) => handleRepositorySelect(e.target.value)}
              className="w-full p-3 bg-background border border-primary/30 rounded text-foreground"
            >
              <option value="">Select a repository</option>
              {repositories.map((repo) => (
                <option key={repo.id} value={repo.full_name}>
                  {repo.full_name} ({repo.language || 'Unknown'})
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {/* Branch Selection */}
      {branches.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Branch
          </label>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="w-full p-3 bg-background border border-primary/30 rounded text-foreground"
          >
            {branches.map((branch) => (
              <option key={branch.name} value={branch.name}>
                {branch.name} {branch.name === repoInfo?.default_branch ? '(default)' : ''}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Repository Information */}
      {repoInfo && (
        <div className="bg-card p-4 rounded-lg border border-primary/30">
          <h4 className="font-semibold text-primary mb-2">{repoInfo.full_name}</h4>
          <p className="text-sm text-muted-foreground mb-2">{repoInfo.description}</p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <span>⭐ {repoInfo.stargazers_count}</span>
            <span>🍴 {repoInfo.forks_count}</span>
            <span>📝 {repoInfo.language}</span>
            <span>📅 Updated: {new Date(repoInfo.updated_at).toLocaleDateString()}</span>
          </div>
        </div>
      )}

      {/* File Selection */}
      {files.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-foreground">
              Code Files ({files.length})
            </label>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={selectAllFiles}
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10"
              >
                Select All
              </Button>
              <Button
                size="sm"
                onClick={clearSelection}
                variant="outline"
                className="border-secondary text-secondary hover:bg-secondary/10"
              >
                Clear
              </Button>
            </div>
          </div>

          <div className="max-h-48 overflow-y-auto border border-primary/30 rounded p-2">
            {files.map((file) => (
              <label
                key={file.path}
                className="flex items-center gap-2 p-2 hover:bg-primary/5 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedFiles.includes(file.path)}
                  onChange={() => handleFileToggle(file.path)}
                  className="rounded"
                />
                <span className="text-sm text-foreground">{file.path}</span>
                <span className="text-xs text-muted-foreground ml-auto">
                  {(file.size / 1024).toFixed(1)} KB
                </span>
              </label>
            ))}
          </div>

          <div className="mt-4">
            <Button
              onClick={importSelectedFiles}
              disabled={selectedFiles.length === 0 || isLoading}
              className="w-full bg-secondary text-background hover:bg-secondary/80"
            >
              Import Selected Files ({selectedFiles.length})
            </Button>
          </div>
        </div>
      )}

      {/* Status */}
      {importStatus && (
        <div className="p-3 bg-card rounded border border-primary/30">
          <div className="flex items-center gap-2">
            {isLoading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            )}
            <span className="text-sm text-foreground">{importStatus}</span>
          </div>
        </div>
      )}

      {/* Imported Code Preview */}
      {importedCode && (
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Imported Code Preview
          </label>
          <div className="bg-gray-900 p-4 rounded border border-primary/30 max-h-64 overflow-y-auto">
            <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">
              {importedCode.substring(0, 1000)}
              {importedCode.length > 1000 && '...\n\n[Code truncated for preview]'}
            </pre>
          </div>
          <div className="flex gap-2 mt-2">
            <Button
              size="sm"
              onClick={() => navigator.clipboard.writeText(importedCode)}
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10"
            >
              📋 Copy to Clipboard
            </Button>
            <Button
              size="sm"
              onClick={() => {
                const blob = new Blob([importedCode], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${repoInfo?.name || 'code'}.txt`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              variant="outline"
              className="border-secondary text-secondary hover:bg-secondary/10"
            >
              💾 Download
            </Button>
          </div>
        </div>
      )}

      {/* Help */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p>💡 <strong>Tip:</strong> Create a Personal Access Token at GitHub Settings → Developer settings → Personal access tokens</p>
        <p>🔒 <strong>Permissions needed:</strong> repo (for private repos), public_repo (for public repos)</p>
        <p>⚡ <strong>Rate limits:</strong> 5,000 requests/hour with token, 60 requests/hour without</p>
      </div>
    </div>
  );
};

export default GitHubCodeImporter;

