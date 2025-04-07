import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PostPreview } from './PostPreview';

// Mock data for testing
const mockPost = {
  id: '1',
  prompt: 'Test prompt',
  content: 'This is test post content',
  caption: 'Test caption',
  hashtags: ['test', 'jest', 'react'],
  tone: 'Professional',
  visualStyle: 'Minimalist',
  imageUrl: 'https://example.com/test-image.jpg',
  userId: 'user1',
  createdAt: new Date().toISOString(),
  status: 'draft',
};

// Mock the useA11y hook
jest.mock('../lib/hooks/useA11y', () => ({
  useA11y: () => ({
    elementRef: { current: null },
    announce: jest.fn(),
  }),
}));

describe('PostPreview Component', () => {
  it('renders the post content correctly', () => {
    render(<PostPreview post={mockPost} />);
    
    // Check for post content
    expect(screen.getByText('This is test post content')).toBeInTheDocument();
    expect(screen.getByText('Test caption')).toBeInTheDocument();
    
    // Check for hashtags
    expect(screen.getByText('#test')).toBeInTheDocument();
    expect(screen.getByText('#jest')).toBeInTheDocument();
    expect(screen.getByText('#react')).toBeInTheDocument();
    
    // Check for metadata
    expect(screen.getByText('Tone: Professional')).toBeInTheDocument();
    expect(screen.getByText('Style: Minimalist')).toBeInTheDocument();
  });

  it('renders with proper accessibility attributes', () => {
    render(<PostPreview post={mockPost} />);
    
    // Check for proper ARIA roles and labels
    const postContainer = screen.getByRole('region', { name: 'Post preview' });
    expect(postContainer).toBeInTheDocument();
    
    // Check for proper image alt text
    const image = screen.getByAltText('Test prompt');
    expect(image).toBeInTheDocument();
    
    // Check for proper heading/content relationships
    const contentHeading = screen.getByText('Content');
    expect(contentHeading).toHaveAttribute('id', 'content-heading');
    
    // Check for proper hashtags list
    const hashtagsList = screen.getByRole('list');
    expect(hashtagsList).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('shows or hides actions based on props', () => {
    // Test with actions shown (default)
    const { rerender } = render(<PostPreview post={mockPost} />);
    expect(screen.getByRole('toolbar', { name: 'Post actions' })).toBeInTheDocument();
    expect(screen.getByText('Like')).toBeInTheDocument();
    expect(screen.getByText('Comment')).toBeInTheDocument();
    
    // Test with actions hidden
    rerender(<PostPreview post={mockPost} showActions={false} />);
    expect(screen.queryByRole('toolbar', { name: 'Post actions' })).not.toBeInTheDocument();
    expect(screen.queryByText('Like')).not.toBeInTheDocument();
    expect(screen.queryByText('Comment')).not.toBeInTheDocument();
  });

  it('renders correctly without an image', () => {
    const postWithoutImage = {
      ...mockPost,
      imageUrl: undefined,
    };
    
    render(<PostPreview post={postWithoutImage} />);
    
    // Verify the image is not present
    expect(screen.queryByAltText('Test prompt')).not.toBeInTheDocument();
    
    // Verify the rest of the content still renders
    expect(screen.getByText('This is test post content')).toBeInTheDocument();
  });

  it('renders correctly without optional fields', () => {
    const minimalPost = {
      id: '2',
      prompt: 'Minimal post',
      content: 'Minimal content',
      hashtags: [],
      userId: 'user1',
      createdAt: new Date().toISOString(),
      status: 'draft',
    };
    
    render(<PostPreview post={minimalPost} />);
    
    // Verify the required content renders
    expect(screen.getByText('Minimal content')).toBeInTheDocument();
    
    // Verify optional fields don't appear
    expect(screen.queryByText('Caption')).not.toBeInTheDocument();
    expect(screen.queryByText('Hashtags')).not.toBeInTheDocument();
    expect(screen.queryByText('Tone:')).not.toBeInTheDocument();
    expect(screen.queryByText('Style:')).not.toBeInTheDocument();
  });
}); 