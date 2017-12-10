Param(
    [string] $commit_message
)

function push_to_aws{

    Param (
        [string] $bucket_name
    )
    aws s3 rm s3://$bucket_name/ --recursive
    aws s3 sync .\ "s3://$bucket_name/" --acl public-read
    aws s3 rm "s3://$bucket_name/.git" --recursive

}

function push_to_github{
    Param(
        [string] $commit_message
    )
    git add .
    git commit -m $commit_message
    git push
}

push_to_github -commit_message $commit_message
push_to_aws -bucket_name "playtetrisonline.com"
