
function push_to_aws{

    Param (
        [string] $bucket_name
    )
    aws s3 sync .\ "s3://$bucket_name/" --acl public-read
    aws s3 rm "s3://$bucket_name/".git

    return 0
}

function push_to_github{
    Param(
        [string] $commit_message
    )
    git add .
    git commit -m $commit_message
    git push
}

push_to_github -commit_message "testing upload process"
push_to_aws -bucket_name "playtetrisonline.com"
