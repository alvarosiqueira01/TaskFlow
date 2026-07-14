
INSERT INTO assignments (id,
    task_id,
    user_id,
    assigned_by
)
VALUES

-- Sarah assigns work

(gen_random_uuid(),
'20000000-0000-0000-0000-000000000001',
'dddddddd-4444-4444-4444-444444444444',
'bbbbbbbb-2222-2222-2222-222222222222'
),

(gen_random_uuid(),
'20000000-0000-0000-0000-000000000002',
'cccccccc-3333-3333-3333-333333333333',
'bbbbbbbb-2222-2222-2222-222222222222'
),

(gen_random_uuid(),
'20000000-0000-0000-0000-000000000003',
'dddddddd-4444-4444-4444-444444444444',
'aaaaaaaa-1111-1111-1111-111111111111'
),

(gen_random_uuid(),
'20000000-0000-0000-0000-000000000004',
'cccccccc-3333-3333-3333-333333333333',
'bbbbbbbb-2222-2222-2222-222222222222'
),

(gen_random_uuid(),
'20000000-0000-0000-0000-000000000005',
'eeeeeeee-5555-5555-5555-555555555555',
'bbbbbbbb-2222-2222-2222-222222222222'
),

(gen_random_uuid(),
'20000000-0000-0000-0000-000000000006',
'eeeeeeee-5555-5555-5555-555555555555',
'aaaaaaaa-1111-1111-1111-111111111111'
),

(gen_random_uuid(),
'20000000-0000-0000-0000-000000000007',
'dddddddd-4444-4444-4444-444444444444',
'bbbbbbbb-2222-2222-2222-222222222222'
),

(gen_random_uuid(),
'20000000-0000-0000-0000-000000000008',
'cccccccc-3333-3333-3333-333333333333',
'aaaaaaaa-1111-1111-1111-111111111111'
),

(gen_random_uuid(),
'20000000-0000-0000-0000-000000000009',
'eeeeeeee-5555-5555-5555-555555555555',
'bbbbbbbb-2222-2222-2222-222222222222'
),

(gen_random_uuid(),
'20000000-0000-0000-0000-000000000010',
'cccccccc-3333-3333-3333-333333333333',
'bbbbbbbb-2222-2222-2222-222222222222'
),

(gen_random_uuid(),
'20000000-0000-0000-0000-000000000011',
'dddddddd-4444-4444-4444-444444444444',
'bbbbbbbb-2222-2222-2222-222222222222'
),

(gen_random_uuid(),
'20000000-0000-0000-0000-000000000012',
'eeeeeeee-5555-5555-5555-555555555555',
'bbbbbbbb-2222-2222-2222-222222222222'
),

(gen_random_uuid(),
'20000000-0000-0000-0000-000000000013',
'cccccccc-3333-3333-3333-333333333333',
'aaaaaaaa-1111-1111-1111-111111111111'
),

(gen_random_uuid(),
'20000000-0000-0000-0000-000000000014',
'dddddddd-4444-4444-4444-444444444444',
'aaaaaaaa-1111-1111-1111-111111111111'
),

(gen_random_uuid(),
'20000000-0000-0000-0000-000000000015',
'cccccccc-3333-3333-3333-333333333333',
'bbbbbbbb-2222-2222-2222-222222222222'
);

-- ============================================================
-- COMMENTS
-- ============================================================

INSERT INTO comments (
    id,
    task_id,
    user_id,
    parent_comment_id,
    content,
    mentions,
    created_at,
    updated_at,
    deleted_at
)
VALUES

-- ============================================================
-- Task 007 - Connect Vue frontend to Fastify API
-- ============================================================

(
'30000000-0000-0000-0000-000000000001',
'20000000-0000-0000-0000-000000000007',
'bbbbbbbb-2222-2222-2222-222222222222',
NULL,
'Please make sure the API client uses the shared authentication interceptor.',
NULL,
NOW() - INTERVAL '4 days',
NOW() - INTERVAL '4 days',
NULL
),

(
'30000000-0000-0000-0000-000000000002',
'20000000-0000-0000-0000-000000000007',
'dddddddd-4444-4444-4444-444444444444',
'30000000-0000-0000-0000-000000000001',
'Already implemented. I''ll push the latest changes after lunch.',
NULL,
NOW() - INTERVAL '4 days' + INTERVAL '30 minutes',
NOW() - INTERVAL '4 days' + INTERVAL '30 minutes',
NULL
),

(
'30000000-0000-0000-0000-000000000003',
'20000000-0000-0000-0000-000000000007',
'eeeeeeee-5555-5555-5555-555555555555',
NULL,
'Tested on Chrome and Firefox. Everything looks good so far.',
NULL,
NOW() - INTERVAL '3 days',
NOW() - INTERVAL '3 days',
NULL
),

(
'30000000-0000-0000-0000-000000000004',
'20000000-0000-0000-0000-000000000007',
'cccccccc-3333-3333-3333-333333333333',
NULL,
'@michael.qa Could you also validate the mobile layout?',
ARRAY['eeeeeeee-5555-5555-5555-555555555555'],
NOW() - INTERVAL '2 days',
NOW() - INTERVAL '2 days',
NULL
),

-- ============================================================
-- Task 010 - JWT Refresh Token
-- ============================================================

(
'30000000-0000-0000-0000-000000000005',
'20000000-0000-0000-0000-000000000010',
'bbbbbbbb-2222-2222-2222-222222222222',
NULL,
'Remember that refresh tokens should be stored in HttpOnly cookies.',
NULL,
NOW() - INTERVAL '3 days',
NOW() - INTERVAL '3 days',
NULL
),

(
'30000000-0000-0000-0000-000000000006',
'20000000-0000-0000-0000-000000000010',
'cccccccc-3333-3333-3333-333333333333',
'30000000-0000-0000-0000-000000000005',
'Done. I also added automatic token rotation.',
NULL,
NOW() - INTERVAL '3 days' + INTERVAL '1 hour',
NOW() - INTERVAL '3 days' + INTERVAL '1 hour',
NULL
),

(
'30000000-0000-0000-0000-000000000007',
'20000000-0000-0000-0000-000000000010',
'aaaaaaaa-1111-1111-1111-111111111111',
NULL,
'Looks good. Please include audit logging before merging.',
NULL,
NOW() - INTERVAL '2 days',
NOW() - INTERVAL '2 days',
NULL
),

-- ============================================================
-- Task 006 - Duplicate Notifications
-- ============================================================

(
'30000000-0000-0000-0000-000000000008',
'20000000-0000-0000-0000-000000000006',
'eeeeeeee-5555-5555-5555-555555555555',
NULL,
'I can reproduce the issue after assigning the same task multiple times.',
NULL,
NOW() - INTERVAL '2 days',
NOW() - INTERVAL '2 days',
NULL
),

(
'30000000-0000-0000-0000-000000000009',
'20000000-0000-0000-0000-000000000006',
'cccccccc-3333-3333-3333-333333333333',
'30000000-0000-0000-0000-000000000008',
'I found duplicated EventBridge events. Investigating now.',
NULL,
NOW() - INTERVAL '2 days' + INTERVAL '20 minutes',
NOW() - INTERVAL '2 days' + INTERVAL '20 minutes',
NULL
),

(
'30000000-0000-0000-0000-000000000010',
'20000000-0000-0000-0000-000000000006',
'bbbbbbbb-2222-2222-2222-222222222222',
NULL,
'@john.dev Please verify whether the notification service is retrying unnecessarily.',
ARRAY['cccccccc-3333-3333-3333-333333333333'],
NOW() - INTERVAL '2 days',
NOW() - INTERVAL '2 days',
NULL
),

-- ============================================================
-- Task 008 - Terraform Infrastructure
-- ============================================================

(
'30000000-0000-0000-0000-000000000011',
'20000000-0000-0000-0000-000000000008',
'dddddddd-4444-4444-4444-444444444444',
NULL,
'Infrastructure plan completed successfully. Waiting for approval.',
NULL,
NOW() - INTERVAL '4 days',
NOW() - INTERVAL '4 days',
NULL
),

(
'30000000-0000-0000-0000-000000000012',
'20000000-0000-0000-0000-000000000008',
'aaaaaaaa-1111-1111-1111-111111111111',
'30000000-0000-0000-0000-000000000011',
'Approved. You can apply the changes to the development environment.',
NULL,
NOW() - INTERVAL '4 days' + INTERVAL '2 hours',
NOW() - INTERVAL '4 days' + INTERVAL '2 hours',
NULL
),

-- ============================================================
-- Task 011 - Regression Testing
-- ============================================================

(
'30000000-0000-0000-0000-000000000013',
'20000000-0000-0000-0000-000000000011',
'eeeeeeee-5555-5555-5555-555555555555',
NULL,
'Regression suite finished. Only one minor UI issue remains.',
NULL,
NOW() - INTERVAL '1 day',
NOW() - INTERVAL '1 day',
NULL
),

(
'30000000-0000-0000-0000-000000000014',
'20000000-0000-0000-0000-000000000011',
'bbbbbbbb-2222-2222-2222-222222222222',
NULL,
'@emily.dev Could you fix the button alignment before release?',
ARRAY['dddddddd-4444-4444-4444-444444444444'],
NOW() - INTERVAL '20 hours',
NOW() - INTERVAL '20 hours',
NULL
),

-- ============================================================
-- Task 013 - Pre-signed URLs
-- ============================================================

(
'30000000-0000-0000-0000-000000000015',
'20000000-0000-0000-0000-000000000013',
'cccccccc-3333-3333-3333-333333333333',
NULL,
'Streaming upload has been validated using large video files.',
NULL,
NOW() - INTERVAL '5 days',
NOW() - INTERVAL '5 days',
NULL
),

(
'30000000-0000-0000-0000-000000000016',
'20000000-0000-0000-0000-000000000013',
'dddddddd-4444-4444-4444-444444444444',
NULL,
'@admin.user Everything is ready for production deployment.',
ARRAY['aaaaaaaa-1111-1111-1111-111111111111'],
NOW() - INTERVAL '4 days',
NOW() - INTERVAL '4 days',
NULL
);

------------------------------------------------

-- ============================================================
-- NOTIFICATIONS
-- ============================================================

INSERT INTO notifications (
    id,
    user_id,
    task_id,
    comment_id,
    type,
    title,
    message,
    is_read,
    created_at,
    read_at
)
VALUES

-- Assignments

(
'50000000-0000-0000-0000-000000000001',
'dddddddd-4444-4444-4444-444444444444',
'20000000-0000-0000-0000-000000000001',
NULL,
'ASSIGNMENT',
'New task assigned',
'You have been assigned to "Implement dark mode".',
true,
NOW()-INTERVAL '5 days',
NOW()-INTERVAL '5 days'+INTERVAL '30 minutes'
),

(
'50000000-0000-0000-0000-000000000002',
'cccccccc-3333-3333-3333-333333333333',
'20000000-0000-0000-0000-000000000002',
NULL,
'ASSIGNMENT',
'New task assigned',
'You have been assigned to "Provision CloudFront distribution".',
false,
NOW()-INTERVAL '4 days',
NULL
),

(
'50000000-0000-0000-0000-000000000003',
'eeeeeeee-5555-5555-5555-555555555555',
'20000000-0000-0000-0000-000000000006',
NULL,
'ASSIGNMENT',
'Task assigned',
'Investigate duplicate notifications has been assigned to you.',
false,
NOW()-INTERVAL '3 days',
NULL
),

(
'50000000-0000-0000-0000-000000000004',
'cccccccc-3333-3333-3333-333333333333',
'20000000-0000-0000-0000-000000000010',
NULL,
'ASSIGNMENT',
'Task assigned',
'Implement JWT refresh token has been assigned to you.',
true,
NOW()-INTERVAL '2 days',
NOW()-INTERVAL '2 days'+INTERVAL '20 minutes'
),

(
'50000000-0000-0000-0000-000000000005',
'dddddddd-4444-4444-4444-444444444444',
'20000000-0000-0000-0000-000000000011',
NULL,
'ASSIGNMENT',
'Task assigned',
'Regression testing has been assigned to you.',
false,
NOW()-INTERVAL '1 day',
NULL
),

-- Mentions

(
'50000000-0000-0000-0000-000000000006',
'eeeeeeee-5555-5555-5555-555555555555',
'20000000-0000-0000-0000-000000000007',
'30000000-0000-0000-0000-000000000004',
'MENTION',
'You were mentioned',
'Sarah mentioned you in a task comment.',
false,
NOW()-INTERVAL '2 days',
NULL
),

(
'50000000-0000-0000-0000-000000000007',
'cccccccc-3333-3333-3333-333333333333',
'20000000-0000-0000-0000-000000000006',
'30000000-0000-0000-0000-000000000010',
'MENTION',
'You were mentioned',
'Sarah requested your review.',
true,
NOW()-INTERVAL '2 days',
NOW()-INTERVAL '2 days'+INTERVAL '15 minutes'
),

(
'50000000-0000-0000-0000-000000000008',
'dddddddd-4444-4444-4444-444444444444',
'20000000-0000-0000-0000-000000000011',
'30000000-0000-0000-0000-000000000014',
'MENTION',
'You were mentioned',
'Michael requested a UI adjustment.',
false,
NOW()-INTERVAL '20 hours',
NULL
),

(
'50000000-0000-0000-0000-000000000009',
'aaaaaaaa-1111-1111-1111-111111111111',
'20000000-0000-0000-0000-000000000013',
'30000000-0000-0000-0000-000000000016',
'MENTION',
'You were mentioned',
'Emily confirmed the deployment is ready.',
true,
NOW()-INTERVAL '4 days',
NOW()-INTERVAL '4 days'+INTERVAL '10 minutes'
),

-- Task Updates

(
'50000000-0000-0000-0000-000000000010',
'bbbbbbbb-2222-2222-2222-222222222222',
'20000000-0000-0000-0000-000000000010',
NULL,
'TASK_UPDATED',
'Task moved to Review',
'Implement JWT refresh token is ready for review.',
false,
NOW()-INTERVAL '2 days',
NULL
),

(
'50000000-0000-0000-0000-000000000011',
'bbbbbbbb-2222-2222-2222-222222222222',
'20000000-0000-0000-0000-000000000013',
NULL,
'TASK_UPDATED',
'Task completed',
'Generate pre-signed upload URLs was completed.',
true,
NOW()-INTERVAL '1 day',
NOW()-INTERVAL '22 hours'
),

(
'50000000-0000-0000-0000-000000000012',
'aaaaaaaa-1111-1111-1111-111111111111',
'20000000-0000-0000-0000-000000000008',
NULL,
'TASK_UPDATED',
'Infrastructure updated',
'Terraform infrastructure entered In Progress.',
false,
NOW()-INTERVAL '4 days',
NULL
),

(
'50000000-0000-0000-0000-000000000013',
'cccccccc-3333-3333-3333-333333333333',
'20000000-0000-0000-0000-000000000007',
NULL,
'TASK_UPDATED',
'Task updated',
'Task description has changed.',
true,
NOW()-INTERVAL '3 days',
NOW()-INTERVAL '3 days'+INTERVAL '5 minutes'
),

(
'50000000-0000-0000-0000-000000000014',
'dddddddd-4444-4444-4444-444444444444',
'20000000-0000-0000-0000-000000000012',
NULL,
'TASK_UPDATED',
'Priority updated',
'Task priority changed to High.',
false,
NOW()-INTERVAL '1 day',
NULL
),

(
'50000000-0000-0000-0000-000000000015',
'eeeeeeee-5555-5555-5555-555555555555',
'20000000-0000-0000-0000-000000000015',
NULL,
'TASK_UPDATED',
'Pipeline completed',
'CI/CD pipeline implementation has been completed.',
true,
NOW()-INTERVAL '2 days',
NOW()-INTERVAL '2 days'+INTERVAL '10 minutes'
),

-- Extra notifications

(
'50000000-0000-0000-0000-000000000016',
'bbbbbbbb-2222-2222-2222-222222222222',
'20000000-0000-0000-0000-000000000007',
NULL,
'TASK_UPDATED',
'Task in progress',
'Development has started.',
false,
NOW()-INTERVAL '4 days',
NULL
),

(
'50000000-0000-0000-0000-000000000017',
'bbbbbbbb-2222-2222-2222-222222222222',
'20000000-0000-0000-0000-000000000006',
NULL,
'TASK_UPDATED',
'Bug investigation started',
'Michael started investigating duplicate notifications.',
false,
NOW()-INTERVAL '2 days',
NULL
),

(
'50000000-0000-0000-0000-000000000018',
'aaaaaaaa-1111-1111-1111-111111111111',
'20000000-0000-0000-0000-000000000014',
NULL,
'TASK_UPDATED',
'Authentication completed',
'Auth service implementation finished successfully.',
true,
NOW()-INTERVAL '4 days',
NOW()-INTERVAL '4 days'+INTERVAL '20 minutes'
),

(
'50000000-0000-0000-0000-000000000019',
'cccccccc-3333-3333-3333-333333333333',
'20000000-0000-0000-0000-000000000009',
NULL,
'TASK_UPDATED',
'Task reminder',
'Responsive mobile layout is approaching its due date.',
false,
NOW()-INTERVAL '6 hours',
NULL
),

(
'50000000-0000-0000-0000-000000000020',
'dddddddd-4444-4444-4444-444444444444',
'20000000-0000-0000-0000-000000000013',
NULL,
'TASK_UPDATED',
'Deployment completed',
'Streaming upload feature deployed successfully.',
true,
NOW()-INTERVAL '1 day',
NOW()-INTERVAL '23 hours'
);
