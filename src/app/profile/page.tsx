'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ApiService } from '@/services/apiService';
import { Post } from '@/types/api';
import styles from './page.module.scss';
import Link from 'next/link';

type PostFormState = {
  title: string;
  description: string;
  tags: string[];
};

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [titleFilter, setTitleFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPost, setNewPost] = useState<PostFormState>({
    title: '',
    description: '',
    tags: [],
  });
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editPost, setEditPost] = useState<PostFormState>({
    title: '',
    description: '',
    tags: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_page: 0,
    total: 0,
    page_size: 10,
  });

  console.log(user);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/signin');
      return;
    }

    fetchPosts();
    fetchTags();
  }, [isAuthenticated, router, titleFilter, tagFilter, currentPage]);

  const fetchTags = async () => {
    try {
      const response = await ApiService.getPostTags();
      if (response.success && Array.isArray(response.data)) {
        setAvailableTags(response.data);
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getPosts({
        title: titleFilter,
        page: currentPage,
        tags: tagFilter,
      });
      if (response.success && Array.isArray(response.data)) {
        setPosts(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        const response = await ApiService.deletePost(id);
        if (response.success) {
          setPosts(posts.filter((post) => post.id !== id));
        }
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const handleAddPost = async () => {
    try {
      const response = await ApiService.createPost({
        title: newPost.title,
        description: newPost.description,
        tags: newPost.tags,
      });
      if (response.success) {
        setNewPost({ title: '', description: '', tags: [] });
        setShowAddModal(false);
        setCurrentPage(1); // Reset to first page after adding
        fetchPosts(); // Refresh list
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setEditPost({
      title: post.title,
      description: post.description,
      tags: post.tags,
    });
    setShowEditModal(true);
  };

  const handleUpdatePost = async () => {
    if (!editingPost) return;

    try {
      const response = await ApiService.updatePost(editingPost.id, {
        title: editPost.title,
        description: editPost.description,
        tags: editPost.tags,
      });
      if (response.success) {
        setShowEditModal(false);
        setEditingPost(null);
        fetchPosts(); // Refresh list
      }
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.total_page) {
      setCurrentPage(newPage);
    }
  };

  const handleFilterChange = () => {
    setCurrentPage(1); // Reset to first page when filtering
  };

  if (!isAuthenticated || loading) {
    return (
      <div className={styles.loading}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className={styles.profilePage}>
      <div className={styles.sidebar}>
        <div className={styles.profile}>
          <Link href="/" className={styles.logo}>
            <div className={styles.logoContainer}>
              <div className={styles.logoCircle1}></div>
              <div className={styles.logoCircle2}></div>
            </div>
          </Link>
        </div>
        <nav className={styles.nav}>
          <div className={styles.navItem}>Posts</div>
          <button onClick={logout} className={styles.logoutBtn}>
            Logout
          </button>
        </nav>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.header}>
          <button
            className={styles.addBtn}
            onClick={() => setShowAddModal(true)}
          >
            Add new
          </button>
          <div className={styles.filters}>
            <input
              type="text"
              placeholder="Title"
              value={titleFilter}
              onChange={(e) => {
                setTitleFilter(e.target.value);
                handleFilterChange();
              }}
              className={styles.filterInput}
            />
            <select
              value={tagFilter}
              onChange={(e) => {
                setTagFilter(e.target.value);
                handleFilterChange();
              }}
              className={styles.filterSelect}
            >
              <option value="">Tags</option>
              {availableTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Tags</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(posts) && posts.length > 0 ? (
                posts.map((post, index) => (
                  <tr key={post.id}>
                    <td>
                      {(currentPage - 1) * pagination.page_size + index + 1}
                    </td>
                    <td>{post.title}</td>
                    <td>{post.description}</td>
                    <td>{post.tags?.join(', ') || ''}</td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          className={styles.editBtn}
                          onClick={() => handleEditPost(post)}
                        >
                          ✏️
                        </button>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => handleDelete(post.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    style={{ textAlign: 'center', padding: '20px' }}
                  >
                    No posts found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className={styles.pagination}>
          <div className={styles.paginationInfo}>
            Hiển thị{' '}
            {posts.length > 0
              ? (currentPage - 1) * pagination.page_size + 1
              : 0}{' '}
            - {(currentPage - 1) * pagination.page_size + posts.length} của{' '}
            {pagination.total} posts
          </div>
          <div className={styles.paginationControls}>
            <button
              className={`${styles.paginationBtn} ${
                currentPage === 1 ? styles.disabled : ''
              }`}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            {Array.from({ length: pagination.total_page }, (_, i) => i + 1)
              .filter((page) => {
                // Show first page, last page, current page, and 2 pages around current
                return (
                  page === 1 ||
                  page === pagination.total_page ||
                  (page >= currentPage - 2 && page <= currentPage + 2)
                );
              })
              .map((page, index, array) => {
                // Add ellipsis if there's a gap
                const showEllipsisBefore =
                  index > 0 && page - array[index - 1] > 1;
                return (
                  <React.Fragment key={page}>
                    {showEllipsisBefore && (
                      <span className={styles.ellipsis}>...</span>
                    )}
                    <button
                      className={`${styles.paginationBtn} ${
                        currentPage === page ? styles.active : ''
                      }`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                );
              })}

            <button
              className={`${styles.paginationBtn} ${
                currentPage === pagination.total_page ? styles.disabled : ''
              }`}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.total_page}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Add New Post</h3>
            <input
              type="text"
              placeholder="Title"
              value={newPost.title}
              onChange={(e) =>
                setNewPost({ ...newPost, title: e.target.value })
              }
              className={styles.modalInput}
            />
            <textarea
              placeholder="Description"
              value={newPost.description}
              onChange={(e) =>
                setNewPost({ ...newPost, description: e.target.value })
              }
              className={styles.modalTextarea}
            />
            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={newPost.tags.join(', ')}
              onChange={(e) =>
                setNewPost({
                  ...newPost,
                  tags: e.target.value
                    .split(',')
                    .map((tag) => tag.trim())
                    .filter((tag) => tag),
                })
              }
              className={styles.modalInput}
            />
            <div className={styles.modalActions}>
              <button onClick={handleAddPost} className={styles.saveBtn}>
                Save
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className={styles.cancelBtn}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && editingPost && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Edit Post</h3>
            <input
              type="text"
              placeholder="Title"
              value={editPost.title}
              onChange={(e) =>
                setEditPost({ ...editPost, title: e.target.value })
              }
              className={styles.modalInput}
            />
            <textarea
              placeholder="Description"
              value={editPost.description}
              onChange={(e) =>
                setEditPost({ ...editPost, description: e.target.value })
              }
              className={styles.modalTextarea}
            />
            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={editPost.tags.join(', ')}
              onChange={(e) =>
                setEditPost({
                  ...editPost,
                  tags: e.target.value
                    .split(',')
                    .map((tag) => tag.trim())
                    .filter((tag) => tag),
                })
              }
              className={styles.modalInput}
            />
            <div className={styles.modalActions}>
              <button onClick={handleUpdatePost} className={styles.saveBtn}>
                Update
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className={styles.cancelBtn}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
